const AccessLogsList                          = require('../../../../lib/services/admin/accessLogs/List');
const { default: AccessLog, INITIATOR_TYPES } = require('../../../../lib/models/AccessLog');
const AccessTokenReader                       = require('../../../../lib/models/AccessTokenReader');
const TestFactory                             = require('../../../utils');
const [ accessTokenReader ]                   = require('../../../fixtures/accessTokenReaders');
const accessLogs                              = require('../../../fixtures/accessLogs');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessLogs List', () => {
    let service = null;

    beforeAll(async () => {
        await factory.initializeWorkspace();
        await factory.runInTransaction(async () => {
            await AccessTokenReader.create(accessTokenReader)
            await AccessLog.bulkCreate(accessLogs);
        });
    });

    afterAll(async () => {
        await factory.end();
    });

    beforeEach(() => {
        service = new AccessLogsList({ context: {} });
    });

    test('POSITIVE: show access logs', factory.wrapInRollbackTransaction(async () => {
        const serviceResult = await service.run({ sortedBy: "status" });
        const serviceResultSortedData = serviceResult.data.sort((a, b) => a.id - b.id);

        expect(serviceResultSortedData).toMatchObject(accessLogs);
    }));

    test(
        'POSITIVE: should return access logs only with specified initiatorType value',
        factory.wrapInRollbackTransaction(async () => {
            const serviceResult = await service.run({ 
                initiatorTypes : [ INITIATOR_TYPES.ACCESS_POINT, INITIATOR_TYPES.PHONE ] 
            });

            expect(serviceResult).toHaveProperty('data');
            expect(serviceResult).toHaveProperty('meta');
            expect(serviceResult.data)
                .toContainEqual(expect.objectContaining(
                    { initiatorType: INITIATOR_TYPES.ACCESS_POINT }
                ));
            expect(serviceResult.data)
                .toContainEqual(expect.objectContaining(
                    { initiatorType: INITIATOR_TYPES.PHONE }
                ));
            expect(serviceResult.data)
                .not
                .toContainEqual(expect.objectContaining(
                    { initiatorType: INITIATOR_TYPES.BUTTON }
                ));
            expect(serviceResult.data)
                .not
                .toContainEqual(expect.objectContaining(
                    { initiatorType: INITIATOR_TYPES.SUBJECT }
                ));
        })
    );
});
