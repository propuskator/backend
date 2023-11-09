const AccessSchedulesCreate = require('../../../../lib/services/admin/accessSchedules/Create');
const AccessSchedulesList = require('../../../../lib/services/admin/accessSchedules/List');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSchedules List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: List AccessSchedules', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSchedulesCreate = await (new AccessSchedulesCreate({ context: {} })).run({
            name: "schedulename",
            dates: [
                {
                    from: new Date(1)/1,
                    to: new Date(1)/1
                }
            ]
        });
        const service = new AccessSchedulesList({ context: {} });
        const res = await service.run({ search: "schedulename" });

        expect(res).toMatchObject({
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
    }));
});
