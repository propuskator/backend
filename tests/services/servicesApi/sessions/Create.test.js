const SessionCreate = require('../../../../lib/services/servicesApi/sessions/Create');
const TestFactory = require('../../../utils');
const { ForbiddenError, ValidationError } = require('../../../../lib/services/utils/SX');

jest.setTimeout(30000);
const factory = new TestFactory();


describe('serviceApi: sessions/Create service', () => {
    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: create token', factory.wrapInTransaction(async () => {
        const service = new SessionCreate({ context: {} });
        const res = await service.run({
            type : 'modbus',
            token : 'token',
            payload : {
                workspace : 'qwe'
            }
        });

        expect(res.data).toHaveProperty('jwt');
        expect(typeof res.data.jwt).toBe('string');
    }));

    test('NEGATIVE: create token with bad type', factory.wrapInTransaction(async () => {
        const service = new SessionCreate({ context: {} });
        try {
            await service.run({
                type : 'knx',
                token : 'token',
                payload : {
                    workspace : 'qwe'
                }
            });
        } catch (e) {
            expect(e.code).toBe(ForbiddenError.codes.INVALID_SERVICE_CREDENTIALS);
        }
    }));

    test('NEGATIVE: create token with bad token', factory.wrapInTransaction(async () => {
        const service = new SessionCreate({ context: {} });
        try {
            await service.run({
                type : 'modbus',
                token : 'tokentoken',
                payload : {
                    workspace : 'qwe'
                }
            });
        } catch (e) {
            expect(e.code).toBe(ForbiddenError.codes.INVALID_SERVICE_CREDENTIALS);
        }
    }));

    test('NEGATIVE: create token without workspace', factory.wrapInTransaction(async () => {
        const service = new SessionCreate({ context: {} });
        try {
            await service.run({
                type : 'modbus',
                token : 'token',
                payload : {}
            });
        } catch (e) {
            expect(e.code).toBe(ValidationError.codes.WORKSPACE_NOT_FOUND, { field: 'workspace' });
        }
    }));
});
