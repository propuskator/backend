import {DataTypes as DT} from "sequelize/lib/sequelize";

const NotificationsList = require('../../../../lib/services/admin/notifications/List');
const Notification = require('../../../../lib/models/Notification');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

let accessTokenReader = null;
describe('admin Notifications List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: List Notifications', factory.wrapInRollbackTransaction(async () => {
        await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            data      : {"tokenReaderCode": "newdevice1"}
        })
        const service = new NotificationsList({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            data: [
                {
                    type      : "NEW_READER",
                    message   : "message",
                    isRead    : false,
                    data      : {"tokenReaderCode": "newdevice1"}
                }
            ]
        });
    }));
    test('POSITIVE: List Notifications by type', factory.wrapInRollbackTransaction(async () => {
        await Notification.create({
            type      : "DELETED_SUBJECT_PROFILE",
            message   : "message",
            data      : { "subjectId": "123123123" }
        })
        const service = new NotificationsList({ context: {} });
        const res = await service.run({ type: "DELETED_SUBJECT_PROFILE" });

        expect(res).toMatchObject({
            data: [
                {
                    type      : "DELETED_SUBJECT_PROFILE",
                    message   : "message",
                    isRead    : false,
                    data      : { "subjectId": "123123123" }
                }
            ]
        });
    }));
    test('POSITIVE: List Notifications default sort by isRead=0', factory.wrapInRollbackTransaction(async () => {
        await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            data      : {"tokenReaderCode": "newdevice1"},
            isRead    : true
        });
        await Notification.create({
            type      : "NEW_READER",
            message   : "message",
            data      : {"tokenReaderCode": "newdevice2"},
            isRead    : false,
            createdAt : 0 // 1 Jan 1975
        });

        const service = new NotificationsList({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            data: [
                {
                    type      : "NEW_READER",
                    message   : "message",
                    data      : {"tokenReaderCode": "newdevice2"},
                    isRead    : false
                },
                {
                    type      : "NEW_READER",
                    message   : "message",
                    isRead    : true,
                    data      : {"tokenReaderCode": "newdevice1"}
                }
            ]
        });

        // isRead: false should be first
        expect(res.data[0].isRead).toEqual(false);
    }));
});
