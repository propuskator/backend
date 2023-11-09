const AdminUsersRegister = require('../../../../lib/services/admin/adminUsers/Register');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AdminUsers Register', () => {
    beforeAll(async () => {
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: register admin', factory.wrapInRollbackTransaction(async () => {
        const service = new AdminUsersRegister({ context: {} });
        const res = await service.run({
            workspace    : 'workspace',
            login        : 'adminlogin@gmail.com',
            timezone     : '(UTC) Coordinated Universal Time',
            password     : '2SmartAccess',
            passwordConfirm : '2SmartAccess'
        });

        expect(res).toMatchObject({
            data: {
                login    : 'adminlogin@gmail.com'
            }
        });
    }));
});
