const AdminUsersShow = require('../../../../lib/services/admin/adminUsers/Show');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AdminUsers Show', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace({ login: 'logintest@gmail.com' });
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: show admin', factory.wrapInRollbackTransaction(async () => {
        const service = new AdminUsersShow({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            data: {
                login    : 'logintest@gmail.com'
            }
        });
    }));
});
