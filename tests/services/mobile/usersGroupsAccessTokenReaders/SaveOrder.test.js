const TokenCreate                    = require('../../../../lib/services/admin/accessSubjectTokens/Create.js');
const ReaderCreate                   = require('../../../../lib/services/admin/accessTokenReaders/Create.js');
const AccessReaderGroupsCreate       = require('../../../../lib/services/admin/accessReaderGroups/Create.js');
const AccessReaderMobileGroupsCreate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Create.js');
const AccessReaderMobileGroupsShow   = require('../../../../lib/services/mobile/accessReaderMobileGroups/Show.js');
const ScheduleCreate                 = require('../../../../lib/services/admin/accessSchedules/Create.js');
const SettingsCreate                 = require('../../../../lib/services/admin/accessSettings/Create.js');
const SaveOrder                      = require('../../../../lib/services/mobile/usersGroupsAccessTokenReaders/SaveOrder.js');
const { numberToBitArray }           = require('../../../../lib/services/utils/dumps.js');
const [ accessSubjectToken ]         = require('../../../fixtures/accessSubjectTokens.js');
const [ accessReadersGroup ]         = require('../../../fixtures/accessReadersGroups.js');
const [ accessSchedule ]             = require('../../../fixtures/accessSchedules.js');
const [ accessScheduleDate ]         = require('../../../fixtures/accessScheduleDates.js');
const accessTokenReaders             = require('../../../fixtures/accessTokenReaders.js');
const workspaces                     = require('../../../fixtures/workspaces.js');
const [ user ]                       = require('../../../fixtures/users.js');
const [ accessReadersMobileGroup ]   = require('../../../fixtures/accessReadersMobileGroups.js');
const TestFactory                    = require('../../../utils');
const { registerUser }               = require('../user/utils.js');

const TEST_TIMEOUT = 30000;
const factory      = new TestFactory();

jest.setTimeout(TEST_TIMEOUT);

async function createMobileGroupWithReaders(accessSubjectId) {
    await new TokenCreate({ context: {} }).run({
        name : accessSubjectToken.name,
        code : accessSubjectToken.code
    });

    const accessTokenReaderIds = await Promise.all(accessTokenReaders.map(async reader => {
        const { data: { id } } = await new ReaderCreate({ context: {} }).run({
            name : reader.name,
            code : reader.code
        });

        return id;
    }));

    const { data: group } = await new AccessReaderGroupsCreate({ context: {} }).run({
        name : accessReadersGroup.name,
        accessTokenReaderIds
    });
    const { data: schedule } = await new ScheduleCreate({ context: {} }).run({
        name  : accessSchedule.name,
        dates : [
            {
                weekBitMask        : numberToBitArray(accessScheduleDate.weekBitMask, 7),
                dailyIntervalStart : accessScheduleDate.dailyIntervalStart,
                dailyIntervalEnd   : accessScheduleDate.dailyIntervalEnd,
            }
        ]
    });

    await new SettingsCreate({ context: {} }).run({
        accessReadersGroupIds : [ group.id ],
        accessScheduleIds     : [ schedule.id ],
        accessSubjectIds      : [ accessSubjectId ],
        accessTokenReaderIds
    });

    const createReadersMobileGroupService = new AccessReaderMobileGroupsCreate({ context: {} });

    createReadersMobileGroupService.cls.set('accessSubjectId', accessSubjectId);

    const { data: { id: readersMobileGroupId } } = await createReadersMobileGroupService.run({
        name : accessReadersMobileGroup.name,
        accessTokenReaderIds
    })

    return readersMobileGroupId;
}

describe('mobile: usersGroupsAccessTokenReaders/SaveOrder service', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: should successfully save changed users access token readers order for the group',
        factory.wrapInRollbackTransaction(async () => {
            const {
                subject : { id: accessSubjectId },
                user    : { id: userId }
            } = await registerUser({
                email     : user.email,
                workspace : workspaces.find(workspace => workspace.id === user.workspaceId)?.name,
                password  : user.password
            });
            const groupId = await createMobileGroupWithReaders(accessSubjectId);
            const showReadersMobileGroupService = new AccessReaderMobileGroupsShow({ context: {} });

            showReadersMobileGroupService.cls.set('accessSubjectId', accessSubjectId);
            showReadersMobileGroupService.cls.set('userId', userId);

            const { data: groupWithDefaultReadersOrder } = await showReadersMobileGroupService.run({ id: groupId });
            const readersDefaultOrder = groupWithDefaultReadersOrder.accessTokenReaders.map(({ id }) => id);
            const readersChangedOrder = [ ...readersDefaultOrder.slice(1), readersDefaultOrder[0] ];

            await new SaveOrder({ context: {} }).run({
                accessReadersMobileGroupId : groupId,
                accessTokenReadersOrder    : readersChangedOrder
            });

            const { data: groupWithChangedReadersOrder } = await showReadersMobileGroupService.run({ id: groupId });
            const receivedReadersChangedOrder = groupWithChangedReadersOrder.accessTokenReaders.map(({ id }) => id);

            expect(receivedReadersChangedOrder).toMatchObject(readersChangedOrder);
        })
    )
});
