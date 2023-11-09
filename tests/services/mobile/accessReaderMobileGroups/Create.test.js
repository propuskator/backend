const GroupCreate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Create');
const ReaderCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const mobileReaderGroupLogsPaths = require('../../../../etc/accessReaderMobileGroups/paths');
const TestFactory = require('../../../utils');
const { registerUser } = require('../user/utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('mobile AccessReaderMobileGroups Create', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessReaderMobileGroups', factory.wrapInRollbackTransaction(async () => {
        const { subject: { id: accessSubjectId }}  = await registerUser({ 
            email: 'testik@gmail.com',
            workspace: 'workspace',
            password: 'Test1234'
        });

        const accessTokenReader = await(new ReaderCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        })

        const createGroupService = new GroupCreate({ context: {} });

        createGroupService.cls.set('accessSubjectId', accessSubjectId);
        const res = await createGroupService.run({
            name: "groupname",
            logoType: "bathRoom",
            accessTokenReaderIds: [accessTokenReader.data.id]
        });


        expect(res).toMatchObject({
            data: {
                name: "groupname",
                logoPath: mobileReaderGroupLogsPaths["bathRoom"],
                logoColor : '#DFDFDF',
                accessTokenReaders : [
                    {
                        name: 'readername',
                        code: 'readercode',
                        connectionStatus: {
                            color : 'yellow',
                            title : 'Init'
                        }
                    }
                ]
            }
        });
    }));
    test('NEGATIVE: can`t create AccessReaderMobileGroups ', factory.wrapInRollbackTransaction(async () => {
        const { subject: { id: accessSubjectId }} = await registerUser({ 
            email: 'testik@gmail.com',
            workspace: 'workspace',
            password: 'Test1234'
        });
        const createGroupService = new GroupCreate({ context: {} });

        createGroupService.cls.set('accessSubjectId', accessSubjectId);

        try {
            await createGroupService.run({
                name: "groupname",
                logoType: "some-wrong-logo"
            });
        } catch(e) {
            expect(e.code).toEqual('FORMAT_ERROR');
        }

        try {
            await createGroupService.run({
                name: "groupname",
                accessTokenReaderIds: ['12345', '12345']
            });
        } catch(e) {
            expect(e.code).toEqual('FORMAT_ERROR');
            expect(e.fields.accessTokenReaderIds).toEqual('NOT_UNIQUE_ITEMS');
        }

        try {
            await createGroupService.run({
                name: "groupname",
                accessTokenReaderIds: ['23123123']
            });
        } catch(e) {
            expect(e.code).toEqual('FOREIGN_KEY_CONSTRAINT');
        }
    }));
});