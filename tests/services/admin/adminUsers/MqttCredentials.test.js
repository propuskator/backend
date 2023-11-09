const AdminUsersMqttCredentials = require('../../../../lib/services/admin/adminUsers/MqttCredentials');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AdminUsers MqttCredentials', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace({ login: 'logintest@gmail.com' });
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: update admin', factory.wrapInRollbackTransaction(async () => {
        const service = new AdminUsersMqttCredentials({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            data: {
                username    : 'client/logintest@gmail.com'
            }
        });
    }));
});
