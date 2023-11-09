const SessionCheck = require('../../../../lib/services/servicesApi/sessions/Check');
const SessionCreate = require('../../../../lib/services/servicesApi/sessions/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

let token = null;
describe('serviceApi: sessions/Check service', () => {
    beforeAll(async () => {
        await factory.runInTransaction(async () => {
            const service = new SessionCreate({ context: {} });
            const res = await service.run({
                type : 'modbus',
                token : 'token',
                payload : {
                    workspace : 'test'
                }
            });
            token = res.data.jwt;
        });
    });
    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: check is token valid', factory.wrapInTransaction(async () => {
        const expected = {
            data: {
                payload : {
                    workspace : 'test'
                },
                type : 'modbus'
            }
        };
        const service = new SessionCheck({ context: {} });
        const res = await service.run({ token });
        console.log(res);

        expect(res).toMatchObject(expected);
    }));
});