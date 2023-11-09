const TestFactory = require('../../../utils');
const UpdateWorkspaceSettings = require('../../../../lib/services/admin/workspaceSettings/Update');
const ShowWorkspaceSettings = require('../../../../lib/services/admin/workspaceSettings/Show');

jest.setTimeout(30000);
const factory = new TestFactory();

const timezone = '(UTC) Coordinated Universal Time';
const notificationTypes = ['READER_STATE', 'ACCESS_ATTEMPTS'];
const allowCollectMedia = true;

describe('admin update and get workspace settings', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: update and get workspace settings', factory.wrapInRollbackTransaction(async () => {
        const updateWorkspaceSettingsService = new UpdateWorkspaceSettings({ context: {} });
        const showWorkspaceSettings = new ShowWorkspaceSettings({ context: {} });
        updateWorkspaceSettingsService.cls.set('workspaceId', factory.cls.get('workspaceId'));
        showWorkspaceSettings.cls.set('workspaceId', factory.cls.get('workspaceId'));

        const { data: updateRes } = await updateWorkspaceSettingsService.run({
            timezone,
            notificationTypes,
            allowCollectMedia
        });

        expect(updateRes).toEqual({ timezone, notificationTypes, allowCollectMedia });

        const { data: showRes} = await showWorkspaceSettings.run({});

        expect(showRes).toMatchObject({ timezone, notificationTypes, allowCollectMedia });
    }));
});
