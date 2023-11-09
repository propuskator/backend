const GroupCreate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Create');
const GroupDelete = require('../../../../lib/services/mobile/accessReaderMobileGroups/Delete');
const ReaderCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const { registerUser } = require('../user/utils');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('mobile AccessReaderMobileGroups Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderMobileGroups', factory.wrapInRollbackTransaction(async () => {
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
        const { data: { id: createdGroupId } } = await createGroupService.run({
            name: "groupname",
            accessTokenReaderIds: [tokenReader.data.id]
        });

        const deleteGroupService = new GroupDelete({ context: {} });
        deleteGroupService.cls.set('accessSubjectId', accessSubjectId);
        const deleteResult = await deleteGroupService.run({
            id: createdGroupId
        });

        expect(deleteResult).toMatchObject({
            id: createdGroupId
        });
    }));
    test('Negative: can`t delete AccessReaderMobileGroups', factory.wrapInRollbackTransaction(async () => {
        const { subject: { id: accessSubjectId }} = await registerUser({ 
            email: 'testik@gmail.com',
            workspace: 'workspace',
            password: 'Test1234'
        });

        const deleteGroupService = new GroupDelete({ context: {} });
        deleteGroupService.cls.set('accessSubjectId', accessSubjectId);

        try {
            await deleteGroupService.run({
                id: '1231243124124124214'
            });
        } catch(e) {
            expect(e.code).toEqual('CANNOT_FIND_MODEL');
        }
    }));
});
