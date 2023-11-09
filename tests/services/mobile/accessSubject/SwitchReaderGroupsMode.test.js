const SwitchReaderGroupsMode = require('../../../../lib/services/mobile/accessSubjects/SwitchReaderGroupsMode');
const TestFactory = require('../../../utils');
const { registerUser } = require('../user/utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Mobile: show or hide readers groups', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: show readers group', factory.wrapInRollbackTransaction(async () => {
        const { subject: { id: accessSubjectId }} = await registerUser({ 
            email: 'testik@gmail.com',
            workspace: 'workspace',
            password: 'Test1234'
        });

        const { data: { showReaderGroups }} = await (new SwitchReaderGroupsMode({ context: {} })).run({
            id: accessSubjectId,
            showReaderGroups : true
        });

        expect(showReaderGroups).toEqual(true);
    }));

    test('NEGATIVE: can`t show readers groups', factory.wrapInRollbackTransaction(async () => {
        try {
            await (new SwitchReaderGroupsMode({ context: {} })).run({
                id: '123123123123123',
                showReaderGroups : true
            });
        } catch(e) {
            expect(e.type).toEqual('notFound');
            expect(e.code).toEqual('CANNOT_FIND_MODEL');
        }
    }));
});
