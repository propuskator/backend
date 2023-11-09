const TimeShow = require('../../../../../lib/services/tokenReader/v2/time/Show');
const TestFactory = require('../../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('tokenReader Time Show', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: save access logs', factory.wrapInRollbackTransaction(async () => {
        const service = new TimeShow({ context: {} });

        const res = await service.run({});

        expect(res.split(',').length === 3).toEqual(true);
    }));
});
