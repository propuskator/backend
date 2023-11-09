const NotificationsActivate = require('../../../../lib/services/admin/notifications/Activate');
const Notification = require('../../../../lib/models/Notification');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

let accessTokenReader = null;
describe('admin Notifications Activate', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: Activate Notifications', factory.wrapInRollbackTransaction(async () => {
        const notification = await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            isRead    : true,
            data      : {"tokenReaderCode": "newdevice1"}
        })
        const service = new NotificationsActivate({ context: {} });
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
