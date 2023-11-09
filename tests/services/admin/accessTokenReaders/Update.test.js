const AccessTokenReadersUpdate = require('../../../../lib/services/admin/accessTokenReaders/Update');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessTokenReaders Update', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: Update AccessTokenReaders',factory.wrapInRollbackTransaction(async () => {
        const resultAccessTokenReadersCreate = await (new AccessTokenReadersCreate({ context: {} })).run({
            name: "readername",
            code: 'readercode',
            phone: "+380682438956"
        });
        const service = new AccessTokenReadersUpdate({ context: {} });
        const res = await service.run({
            id: resultAccessTokenReadersCreate.data.id,
            name: "readername2",
            phone: null,
            code: 'readercode2'
        });

        expect(res).toMatchObject({
            data: {
                name: 'readername2',
                code: 'readercode2',
                phone: null,
                connectionStatus: {
                    color : 'yellow',
                    title : 'Init'
                }
            }
        });
    }));
});
