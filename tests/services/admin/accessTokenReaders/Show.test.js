const AccessTokenReadersShow = require('../../../../lib/services/admin/accessTokenReaders/Show');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessTokenReaders Show', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: Show AccessTokenReaders', factory.wrapInRollbackTransaction(async () => {
        const resultAccessTokenReadersCreate = await (new AccessTokenReadersCreate({ context: {} })).run({
            name: "readername",
            code: 'readercode'
        });
        const service = new AccessTokenReadersShow({ context: {} });
        const res = await service.run({
            id: resultAccessTokenReadersCreate.data.id
        });

        expect(res).toMatchObject({
            data: {
                name: 'readername',
                code: 'readercode',
                phone: null,
                connectionStatus: {
                    color : 'yellow',
                    title : 'Init'
                }
            }
        });
    }));
});
