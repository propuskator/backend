const GroupCreate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Create');
const GroupShow   = require('../../../../lib/services/mobile/accessReaderMobileGroups/Show');

const CreateReader      = require('../../../../lib/services/admin/accessTokenReaders/Create');
const CreateToken       = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const CreateGroup       = require('../../../../lib/services/admin/accessReaderGroups/Create');
const CreateSettings    = require('../../../../lib/services/admin/accessSettings/Create');
const CreateSchedule    = require('../../../../lib/services/admin/accessSchedules/Create');
const AddDisplayedTopic = require('../../../../lib/services/admin/accessTokenReaders/AddDisplayedTopic');

const { registerUser }            = require('../user/utils');
const TestFactory                 = require('../../../utils');
const [ user ]                    = require('../../../fixtures/users');
const [ accessTokenReader ]       = require('../../../fixtures/accessTokenReaders');
const [ accessReaderMobileGroup ] = require('../../../fixtures/accessReadersMobileGroups');
const [ accessSubjectToken ]      = require('../../../fixtures/accessSubjectTokens');
const [ accessReaderGroup ]       = require('../../../fixtures/accessReadersGroups');
const [ accessSchedule ]          = require('../../../fixtures/accessSchedules');
const [ readerDisplayedTopic ]    = require('../../../fixtures/readersDisplayedTopics');
const workspaces                  = require('../../../fixtures/workspaces');

const factory = new TestFactory();

describe('mobile AccessReaderMobileGroups Show', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: show AccessReaderMobileGroups ', factory.wrapInRollbackTransaction(async () => {
        const { subject: { id: accessSubjectId }, user: { id: userId }} = await registerUser({
            email: 'testik@gmail.com',
            workspace: 'workspace',
            password: 'Test1234'
        });

        const { reader: tokenReader } = await _createSettings(accessSubjectId)

        const createGroupService = new GroupCreate({ context: {} });
        createGroupService.cls.set('accessSubjectId', accessSubjectId);
        const { data: { id: createdGroupId } } = await createGroupService.run({
            name: accessReaderMobileGroup.name,
            accessTokenReaderIds: [tokenReader.id]
        });

        const showGroupService = new GroupShow({ context: {} });
        showGroupService.cls.set('accessSubjectId', accessSubjectId);
        showGroupService.cls.set('userId', userId);
        const showResult = await showGroupService.run({
            id: createdGroupId
        });

        expect(showResult).toMatchObject({
            data: {
                name               : accessReaderMobileGroup.name,
                logoColor          : '#DFDFDF',
                accessTokenReaders : [
                    {
                        name             : accessTokenReader.name,
                        code             : accessTokenReader.code,
                        phone            : accessTokenReader.phone,
                        connectionStatus : {
                            color : 'yellow',
                            title : 'Init'
                        }
                    }
                ]
            }
        });
    }));

    test(
        'POSITIVE: should return phone with undefined value when phone access is disabled',
        factory.wrapInRollbackTransaction(async () => {
            const { subject: { id: accessSubjectId }, user: { id: userId }} = await registerUser({
                email     : user.email,
                workspace : workspaces.find(workspace => workspace.id === user.workspaceId)?.name,
                password  : user.password
            }, {
                phoneEnabled : false
            });

            const { reader: tokenReader } = await _createSettings(accessSubjectId)

            const createGroupService = new GroupCreate({ context: {} });

            createGroupService.cls.set('accessSubjectId', accessSubjectId);

            const { data: { id: createdGroupId } } = await createGroupService.run({
                name                 : accessReaderMobileGroup.name,
                accessTokenReaderIds : [tokenReader.id]
            });

            const showGroupService = new GroupShow({ context: {} });

            showGroupService.cls.set('accessSubjectId', accessSubjectId);
            showGroupService.cls.set('userId', userId);

            const showResult = await showGroupService.run({ id: createdGroupId });

            expect(showResult).toMatchObject({
                data: {
                    name               : accessReaderMobileGroup.name,
                    logoColor          : '#DFDFDF',
                    accessTokenReaders : [
                        {
                            name             : accessTokenReader.name,
                            code             : accessTokenReader.code,
                            phone            : undefined,
                            connectionStatus : {
                                color : 'yellow',
                                title : 'Init'
                            }
                        }
                    ]
                }
            });
        })
    );

    test(
        'POSITIVE: should return access token readers with related displayed topics',
        factory.wrapInRollbackTransaction(async () => {
            const { subject: { id: accessSubjectId }, user: { id: userId }} = await registerUser({
                email     : user.email,
                workspace : workspaces.find(workspace => workspace.id === user.workspaceId)?.name,
                password  : user.password
            }, {
                phoneEnabled : false
            });

            const { reader: tokenReader } = await _createSettings(accessSubjectId)

            const DISPLAYED_TOPIC = readerDisplayedTopic.topic;

            await new AddDisplayedTopic({ context: {} }).run({
                accessTokenReaderId : tokenReader.id,
                topic               : DISPLAYED_TOPIC
            });

            const createGroupService = new GroupCreate({ context: {} });

            createGroupService.cls.set('accessSubjectId', accessSubjectId);

            const { data: { id: createdGroupId } } = await createGroupService.run({
                name                 : accessReaderMobileGroup.name,
                accessTokenReaderIds : [tokenReader.id]
            });

            const showGroupService = new GroupShow({ context: {} });

            showGroupService.cls.set('accessSubjectId', accessSubjectId);
            showGroupService.cls.set('userId', userId);

            const showResult = await showGroupService.run({ id: createdGroupId });

            expect(showResult).toMatchObject({
                data: {
                    name               : accessReaderMobileGroup.name,
                    logoColor          : '#DFDFDF',
                    accessTokenReaders : [
                        {
                            name             : accessTokenReader.name,
                            code             : accessTokenReader.code,
                            phone            : undefined,
                            connectionStatus : {
                                color : 'yellow',
                                title : 'Init'
                            },
                            displayedTopics : [ DISPLAYED_TOPIC ]
                        }
                    ]
                }
            });
        })
    );
});

async function _createSettings(accessSubjectId) {
    // create a token for the subject with current id
    await (new CreateToken({ context: {} })).run({ ...accessSubjectToken, accessSubjectId });

    const { data: reader } = await (new CreateReader({ context: {} }).run(accessTokenReader));
    const { data: group } = await (new CreateGroup({ context: {} })).run({
        ...accessReaderGroup,
        accessTokenReaderIds : [ reader.id ]
    });
    const { data: schedule } = await (new CreateSchedule({ context: {} })).run({
        ...accessSchedule,
        dates: [
            {
                weekBitMask        : [ 0, 0, 0, 1, 1, 1, 1 ],
                dailyIntervalStart : 60000,
                dailyIntervalEnd   : 120000
            }
        ]
    });

    await (new CreateSettings({ context: {} })).run({
        accessReadersGroupIds : [ group.id ],
        accessTokenReaderIds  : [ reader.id ],
        accessScheduleIds     : [ schedule.id ],
        accessSubjectIds      : [ accessSubjectId ]
    });

    return { reader };
}
