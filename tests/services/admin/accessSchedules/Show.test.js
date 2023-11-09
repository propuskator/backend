const AccessSchedulesCreate = require('../../../../lib/services/admin/accessSchedules/Create');
const AccessSchedulesShow = require('../../../../lib/services/admin/accessSchedules/Show');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSchedules Show', () => {
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
        const service = new AccessSchedulesShow({ context: {} });
        const res = await service.run({
            id: resultAccessSchedulesCreate.data.id
        });

        expect(res).toMatchObject({
            data: {
                name: "schedulename",
                dates : [
                    {
                        from: new Date(1)/1,
                        to: new Date(1)/1
                    }
                ]
            }
        });
    }));
});
