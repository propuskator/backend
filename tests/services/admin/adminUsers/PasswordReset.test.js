const AdminUsersRegister = require('../../../../lib/services/admin/adminUsers/Register');
const RequestPasswordReset = require('../../../../lib/services/admin/adminUsers/RequestPasswordReset');
const PasswordReset = require('../../../../lib/services/admin/adminUsers/PasswordReset');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

const admin = {
    workspace    : 'works2fpacfbegergs234231ve',
    login        : 'adminerggerge32erglogin@gmail.com',
    password     : '2SmartAccess',
    passwordConfirm : '2SmartAccess'
};

describe('Admin password reset', () => {
    beforeAll(async () => {});
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: reset password', factory.wrapInRollbackTransaction(async () => {
        const requestPasswordResetService = new RequestPasswordReset({ context: {} });

        await new AdminUsersRegister({ context: {} }).run(admin);
        await requestPasswordResetService.run(admin);

        const resetPasswordToken = requestPasswordResetService.cls.get('resetPasswordToken');

        const { meta: { newToken } } = await new PasswordReset({ context: {} }).run({
            token: resetPasswordToken,
            password: 'Test1234',
            passwordConfirm: 'Test1234'
        });

        expect(typeof newToken === 'string').toEqual(true);
    }));

    test('NEGATIVE: cant reset password to the same', factory.wrapInRollbackTransaction(async () => {
        const requestPasswordResetService = new RequestPasswordReset({ context: {} });

        await new AdminUsersRegister({ context: {} }).run(admin);
        await requestPasswordResetService.run(admin);

        const resetPasswordToken = requestPasswordResetService.cls.get('resetPasswordToken');

        try {
            await new PasswordReset({ context: {} }).run({
                token: resetPasswordToken,
                password: admin.password,
                passwordConfirm: admin.password
            });
        } catch (e) {
            expect(e.type).toEqual('validation')
            expect(e.code).toEqual('PASSWORD_IS_ALREADY_IN_USE')
        }
    }));
});
