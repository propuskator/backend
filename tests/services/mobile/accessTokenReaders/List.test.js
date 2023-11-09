const AccessTokenReader             = require('../../../../lib/models/AccessTokenReader');
const ReaderDisplayedTopic          = require('../../../../lib/models/ReaderDisplayedTopic');
const AccessTokenReadersList        = require('../../../../lib/services/mobile/accessTokenReaders/List');
const ScheduleCreate                = require('../../../../lib/services/admin/accessSchedules/Create');
const SettingsCreate                = require('../../../../lib/services/admin/accessSettings/Create');
const { numberToBitArray }          = require('../../../../lib/services/utils/dumps');
const TestFactory                   = require('../../../utils');
const [ userFixture ]               = require('../../../fixtures/users');
const workspacesFixtures            = require('../../../fixtures/workspaces');
const [ accessTokenReaderFixture ]  = require('../../../fixtures/accessTokenReaders');
const [ accessScheduleFixture ]     = require('../../../fixtures/accessSchedules');
const [ accessScheduleDateFixture ] = require('../../../fixtures/accessScheduleDates');
const { registerUser }              = require('../user/utils');

const factory = new TestFactory();

describe('mobile: accessTokenReaders/List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test(
        'POSITIVE: should successfully return displayed topics in result',
        factory.wrapInRollbackTransaction(async () => {
            const {
                subject : { id: accessSubjectId },
                user    : { id: userId }
            } = await registerUser({
                email     : userFixture.email,
                workspace : workspacesFixtures.find(workspace => workspace.id === userFixture.workspaceId)?.name,
                password  : userFixture.password
            });
            const { data: schedule } = await new ScheduleCreate({ context: {} }).run({
                name  : accessScheduleFixture.name,
                dates : [
                    {
                        weekBitMask        : numberToBitArray(accessScheduleDateFixture.weekBitMask, 7),
                        dailyIntervalStart : accessScheduleDateFixture.dailyIntervalStart,
                        dailyIntervalEnd   : accessScheduleDateFixture.dailyIntervalEnd
                    }
                ]
            });
            const workspaceId = factory.cls.get('workspaceId');
            const reader = await AccessTokenReader.create({ ...accessTokenReaderFixture, workspaceId });

            // give access to current subject for current reader
            await new SettingsCreate({ context: {} }).run({
                accessReadersGroupIds : [],
                accessScheduleIds     : [ schedule.id ],
                accessSubjectIds      : [ accessSubjectId ],
                accessTokenReaderIds  : [ reader.id ]
            });

            const displayedTopic = 'test/topic';

            await ReaderDisplayedTopic.create({ workspaceId, accessTokenReaderId: reader.id, topic: displayedTopic });

            const listAccessTokenReadersService = new AccessTokenReadersList({ context: {} });

            listAccessTokenReadersService.cls.set('userId', userId);

            const result = await new AccessTokenReadersList({ context: {} }).run({});

            expect(result).toMatchObject({
                data : [
                    {
                        displayedTopics : [ displayedTopic ]
                    }
                ]
            });
        })
    );
});
