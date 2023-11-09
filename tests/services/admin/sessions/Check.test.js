const SessionsCheck = require('../../../../lib/services/admin/sessions/Check');
const SessionsCreate = require('../../../../lib/services/admin/sessions/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

let accessTokenReader = null;
describe('admin Sessions Check', () => {
    beforeAll(async () => {
        await factory.runInTransaction(async () => {
            const AdminUsersRegister = require('../../../../lib/services/admin/adminUsers/Register');
            const service = new AdminUsersRegister({ context: {} });
            await service.run({
                workspace    : 'workspace',
                login        : 'adminlogin@gmail.com',
                password     : '2SmartAccess',
                passwordConfirm : '2SmartAccess'
            });
        });
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: check Sessions', factory.wrapInTransaction(async () => {
        const resultSessionsCreate = await (new SessionsCreate({ context: {} })).run({
            login    : 'adminlogin@gmail.com',
            password : '2SmartAccess',
            ip       : '192.168.1.1'
        });
        const service = new SessionsCheck({ context: {} });
        const {
            adminUser,
            tokenData
        } = await service.run({
            token:resultSessionsCreate.data.jwt
        });

        expect(tokenData).toMatchObject({
            userId    : adminUser.id,
        });
    }));
});
