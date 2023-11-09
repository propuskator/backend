const UserRegister = require('../../../../lib/services/mobile/users/Register');
const SessionCreate = require('../../../../lib/services/mobile/sessions/Create');
const UserDelete = require('../../../../lib/services/mobile/users/Delete');
const TestFactory = require('../../../utils');

const { registerUser, deleteUser } = require('./utils');

jest.setTimeout(30000);
const factory = new TestFactory();
const testEmail = 'test-email@test.com';

describe('mobile User Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: user soft delete', factory.wrapInRollbackTransaction(async () => {
        const { user: { id: userId } } = await registerUser({ password: 'newPassword1@', email: testEmail, workspace: 'workspace' });
        
        const deletedId = await deleteUser(userId);

        expect(userId).toEqual(deletedId);
    }));

    test('POSITIVE: restore user after soft delete', factory.wrapInRollbackTransaction(async () => {
        const { user: { id: userId } } = await registerUser({ password: 'newPassword1@', email: testEmail, workspace: 'workspace' });

        await deleteUser(userId);

        const { data: { user } } = await new UserRegister({ context: {} }).run({
            workspace       : 'workspace',
            email           : testEmail,
            password        : 'newPassword22@',
            passwordConfirm : 'newPassword22@'
        });

        expect(user.id).toEqual(userId);
        expect(user.email).toEqual(testEmail);
    }));

    test('NEGATIVE: can`t login after soft delete', factory.wrapInRollbackTransaction(async () => {
        const{ user: { id: userId } } = await registerUser({ password: 'newPassword1@', email: testEmail, workspace: 'workspace' });

        await deleteUser(userId);

        try {
            await new SessionCreate({ context: {} }).run({
                workspace : 'workspace',
                email     : testEmail,
                password  : 'newPassword1@',
                ip        : '192.168.1.1'
            });
        } catch (e) {
            expect(e.type).toEqual('validation');
            expect(e.code).toEqual('WRONG_EMAIL_OR_PASSWORD');
        }    
    }));

    test('NEGATIVE: can`t delete user by wrong id ', factory.wrapInRollbackTransaction(async () => {
        const deleteService = new UserDelete({ context: {} });

        deleteService.cls.set('userId', 142151512245121211);

        try {
            await deleteService.run({});
        } catch(e) {
            expect(e.type).toEqual('notFound');
            expect(e.code).toEqual('CANNOT_FIND_MODEL');
        }
    }));
});


