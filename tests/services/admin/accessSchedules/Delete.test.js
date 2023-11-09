const AccessSchedulesDelete = require('../../../../lib/services/admin/accessSchedules/Delete');
const AccessSchedulesCreate = require('../../../../lib/services/admin/accessSchedules/Create');
const AccessSchedulesList = require('../../../../lib/services/admin/accessSchedules/List');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSchedules Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSchedulesCreate = await (new AccessSchedulesCreate({ context: {} })).run({
            name: "schedulename",
            dates: [
                {
                    from: new Date(1)/1,
                    to: new Date(1)/1
                }
            ]
        });
        const resultAccessSchedulesList_before = await (new AccessSchedulesList({ context: {} })).run({ search: "schedulename" });
        expect(resultAccessSchedulesList_before).toMatchObject({
            data: [
                {
                    name: "schedulename",
                    dates : [
                        {
                            from: new Date(1)/1,
                            to: new Date(1)/1
                        }
                    ]
                }
            ]
        });
        expect(resultAccessSchedulesList_before.data.length).toBe(1);

        const service = new AccessSchedulesDelete({ context: {} });
        const res = await service.run({
            id: resultAccessSchedulesCreate.data.id
        });

        expect(res).toMatchObject({
            id: resultAccessSchedulesCreate.data.id
        });

        
        const resultAccessSchedulesList_after = await (new AccessSchedulesList({ context: {} })).run({ search: "schedulename" });
        expect(resultAccessSchedulesList_after).toMatchObject({
            data: []
        });
        expect(resultAccessSchedulesList_after.data.length).toBe(0);
    }));
});
