const NotificationsDeactivate = require('../../../../lib/services/admin/notifications/Deactivate');
const Notification = require('../../../../lib/models/Notification');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

let accessTokenReader = null;
describe('admin Notifications Deactivate', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: Deactivate Notifications', factory.wrapInRollbackTransaction(async () => {
        const notification = await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            isRead    : false,
            data      : {"tokenReaderCode": "newdevice1"}
        })
        const service = new NotificationsDeactivate({ context: {} });
        const res = await service.run({
            ids:[`${notification.id}`]
        });

        expect(res).toMatchObject({
            ids:[`${notification.id}`],
            meta:{
                affectedCount:1
            }
        });
    }));
});
