const BulkCreate = require('../../../../lib/services/servicesApi/accessTokenReaders/BulkCreate');
const TestFactory = require('../../../utils');
const { ValidationError } = require('../../../../lib/services/utils/SX');

jest.setTimeout(30000);
const factory = new TestFactory();

const data = [
    {
        "name" : "[bridge] Modbus reader 1",
        "code" : "bridge-1"
    },
    {
        "name" : "[bridge] Modbus reader 2",
        "code" : "bridge-2"
    },
    {
        "name" : "[bridge] Modbus reader 3",
        "code" : "bridge-3"
    }
];

describe('serviceApi: accessTokenReaders/BulkCreate service', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: create access points', factory.wrapInTransaction(async () => {
        const service = new BulkCreate({ context: {
            payload : {
                workspace : 'workspace'
            }
        } });
        const res = await service.run({ data });

        expect(res.data.length).toEqual(data.length);
    }));

    test('NEGATIVE: create access points with wrong workspace', factory.wrapInTransaction(async () => {
        const service = new BulkCreate({ context: {
            payload : {
                workspace : 'test'
            }
        } });
        try {
            await service.run({ data });
        } catch (e) {
            expect(e.code).toBe(ValidationError.codes.WORKSPACE_NOT_FOUND);
        }
    }));
});
