const GroupCreate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Create');
const GroupUpdate = require('../../../../lib/services/mobile/accessReaderMobileGroups/Update');
const ReaderCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const { registerUser } = require('../user/utils');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('mobile AccessReaderMobileGroups Update', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: update AccessReaderMobileGroups ', factory.wrapInRollbackTransaction(async () => {
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
            logoType: "kitchen",
            logoColor : '#DF3FDF',
            accessTokenReaderIds: [tokenReader.data.id]
        });

        const updateGroupService = new GroupUpdate({ context: {} });
        updateGroupService.cls.set('accessSubjectId', accessSubjectId);
        const updateResult = await updateGroupService.run({
            id: createdGroupId,
            name: 'new-name',
            logoColor : '#DF1FDF',
            logoType: '',
            accessTokenReaderIds: []
        });

        expect(updateResult).toMatchObject({
            data: {
                name: "new-name",
                logoPath: null,
                logoColor : '#DF1FDF',
                accessTokenReaders: []
            }
        });
    }));
    test('NEGATIVE: can`t update AccessReaderMobileGroups ', factory.wrapInRollbackTransaction(async () => {
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
            logoType: "kitchen",
            accessTokenReaderIds: [tokenReader.data.id]
        });

        const updateGroupService = new GroupUpdate({ context: {} });
        updateGroupService.cls.set('accessSubjectId', accessSubjectId);
       
        try {
            await updateGroupService.run({
                id: createdGroupId,
                name: 'new-name',
                logoType: null,
                accessTokenReaderIds: ['124124124']
            });
        } catch (e) {
            expect(e.type).toEqual('badRequest');
            expect(e.code).toEqual('FOREIGN_KEY_CONSTRAINT');
        }

        try {
            await updateGroupService.run({
                id: '123123123123123132',
                name: 'new-name'
            });
        } catch (e) {
            expect(e.type).toEqual('notFound');
            expect(e.code).toEqual('CANNOT_FIND_MODEL');
        }
    }));
});
