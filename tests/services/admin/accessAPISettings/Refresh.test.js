const cls = require('../../../../lib/cls');
const sequelize = require('../../../../lib/sequelize');
const AccessAPISettingsShow = require('../../../../lib/services/admin/accessAPISettings/Show');
const AccessAPISettingsRefresh = require('../../../../lib/services/admin/accessAPISettings/Refresh');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessAPISettings Refresh', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: refresh api token', factory.wrapInRollbackTransaction(async () => {
        const serviceShow = new AccessAPISettingsShow({ context: {} });
        const serviceRefresh = new AccessAPISettingsRefresh({ context: {} });
        const { data: { token: previousToken } } = await serviceShow.run();
        const { data: { token: newToken } } = await serviceRefresh.run();

        expect(newToken).not.toEqual(previousToken);
    }));
});
