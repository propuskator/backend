const GroupCreate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Create');
const GroupsList = require('../../../../lib/services/mobile/accessReaderMobileGroups/List');
const ReaderCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const { registerUser } = require('../user/utils');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('mobile AccessReaderMobileGroups List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: list AccessReaderMobileGroups ', factory.wrapInRollbackTransaction(async () => {
        const { subject: { id: accessSubjectId }} = await registerUser({ 
            email: 'testik@gmail.com',
            workspace: 'workspace',
            password: 'Test1234'
        });

        const tokenReader = await(new ReaderCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        });

        const createGroupService = new GroupCreate({ context: {} });
        createGroupService.cls.set('accessSubjectId', accessSubjectId);
        await createGroupService.run({
            name: "groupname",
            accessTokenReaderIds: [tokenReader.data.id]
        });

        const listGroupsService = new GroupsList({ context: {} });
        listGroupsService.cls.set('accessSubjectId', accessSubjectId);
        const listResult = await listGroupsService.run({
            search: "groupname",
            sortedBy: 'createdAt',
            order: 'ASC',
            limit: 1,
            offset: 0
        });
        const emptyListResult = await listGroupsService.run({
            search: "does_not_exist"
        });

        expect(listResult).toMatchObject({
            data: [
                {
                    name: "groupname",
                    logoColor : '#DFDFDF'
                }
            ],
            meta: {
                total: 1,
                filteredCount: 1
            }
        });
        expect(emptyListResult).toMatchObject({
            data: [],
            meta: {
                total: 1,
                filteredCount: 0
            }
        });
    }));
});
