const NotificationsReadAll = require('../../../../lib/services/admin/notifications/ReadAll');
const Notification = require('../../../../lib/models/Notification');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin Notifications ReadAll', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: ReadAll Notifications', factory.wrapInRollbackTransaction(async () => {
        // not sure about bulkCreate
        // because of custom create function
        await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            isRead    : true,
            data      : {"tokenReaderCode": "newdevice1"}
        });
        await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            isRead    : false,
            data      : {"tokenReaderCode": "newdevice2"}
        });
        await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            isRead    : false,
            data      : {"tokenReaderCode": "newdevice3"}
        });
        const service = new NotificationsReadAll({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            meta : {
                affectedCount : 2
            }
        });
    }));
});
