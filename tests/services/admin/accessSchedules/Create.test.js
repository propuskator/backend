const AccessSchedulesCreate = require('../../../../lib/services/admin/accessSchedules/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSchedules Create', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessSchedulesCreate type1', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessSchedulesCreate({ context: {} });
        const res = await service.run({
            name: "schedulename",
            dates: [
                {
                    from: new Date(1)/1,
                    to: new Date(1)/1
                }
            ]
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
    test('POSITIVE: create AccessSchedulesCreate type2 jest', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessSchedulesCreate({ context: {} });
        const res = await service.run({
            name: "schedulename2",
            dates: [
                {
                    weekBitMask: [0,0,0,1,1,1,1],
                    dailyIntervalStart: 60000,
                    dailyIntervalEnd: 120000
                }
            ]
        });

        expect(res).toMatchObject({
            data: {
                name: "schedulename2",
                dates : [
                    {
                        weekBitMask: [0,0,0,1,1,1,1],
                        dailyIntervalStart: 60000,
                        dailyIntervalEnd: 120000
                    }
                ]
            }
        });
    }));
    test('POSITIVE: create AccessSchedulesCreate type3', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessSchedulesCreate({ context: {} });
        const res = await service.run({
            name: "schedulename3",
            dates: [
                {
                    from: new Date(1)/1,
                    to: new Date(1)/1,
                    weekBitMask: [0,0,0,1,1,1,1],
                    dailyIntervalStart: 60000,
                    dailyIntervalEnd: 120000
                }
            ]
        });

        expect(res).toMatchObject({
            data: {
                name: "schedulename3",
                dates : [
                    {
                        from: new Date(1)/1,
                        to: new Date(1)/1,
                        weekBitMask: [0,0,0,1,1,1,1],
                        dailyIntervalStart: 60000,
                        dailyIntervalEnd: 120000
                    }
                ]
            }
        });
    }));

    test('NEGATIVE: can`t create schedule where `to` less than `from`', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessSchedulesCreate({ context: {} });

        try {
            await service.run({
                name: "schedulename3",
                dates: [
                    {
                        from: new Date(2)/1,
                        to: new Date(1)/1,
                        weekBitMask: [0,0,0,1,1,1,1],
                        dailyIntervalStart: 60000,
                        dailyIntervalEnd: 120000
                    }
                ]
            });
        } catch (e) {
            expect(e.code).toEqual('FORMAT_ERROR');
            expect(e.fields['dates/0/to']).toEqual('WRONG_DATES_VALUES_IN_PERIOD');
        }
    }));
});
