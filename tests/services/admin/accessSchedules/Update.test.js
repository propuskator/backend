const AccessSchedulesCreate = require('../../../../lib/services/admin/accessSchedules/Create');
const AccessSchedulesUpdate = require('../../../../lib/services/admin/accessSchedules/Update');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSchedules Update', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: Update AccessSchedules', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSchedulesCreate = await (new AccessSchedulesCreate({ context: {} })).run({
            name: "schedulename",
            dates: [
                {
                    from: new Date(1)/1,
                    to: new Date(1)/1
                }
            ]
        });
        const service = new AccessSchedulesUpdate({ context: {} });
        const res = await service.run({
            id: resultAccessSchedulesCreate.data.id,
            name: "schedulename2",
            dates: [
                {
                    from: new Date(2)/1,
                    to: new Date(2)/1
                }
            ]
        });

        expect(res).toMatchObject({
            data: {
                name: "schedulename2",
                dates : [
                    {
                        from: new Date(2)/1,
                        to: new Date(2)/1
                    }
                ]
            }
        });
    }));
});
