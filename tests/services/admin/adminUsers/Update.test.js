const AdminUsersUpdate = require('../../../../lib/services/admin/adminUsers/Update');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AdminUsers Update', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace({ login: 'logintest@gmail.com' });
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: update admin', factory.wrapInRollbackTransaction(async () => {
        const service = new AdminUsersUpdate({ context: {} });
        await service.run({});
    }));
});
