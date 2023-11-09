const AccessTokenReadersList = require('../../../../lib/services/admin/accessTokenReaders/List');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessTokenReaders List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: List AccessTokenReaders', factory.wrapInRollbackTransaction(async () => {
            await (new AccessTokenReadersCreate({ context: {} })).run({
                name: "readername",
                code: 'readercode'
            });
            const service = new AccessTokenReadersList({ context: {} });
            const res = await service.run({});

            expect(res).toMatchObject({
                data: [
                    {
                        name: 'readername',
                        code: 'readercode',
                        phone: null,
                        connectionStatus: {
                            color : 'yellow',
                            title : 'Init'
                        }
                    }
                ]
            });
    }));
    test('POSITIVE: Search AccessTokenReaders by connectionStatus', factory.wrapInRollbackTransaction(async () => {
        await (new AccessTokenReadersCreate({ context: {} })).run({
            name: "readername",
            code: 'readercode'
        });
        const service = new AccessTokenReadersList({ context: {} });
        const notEmptyResponse = await service.run({ connectionStatus: 'Init' });
        const emptyResponse = await service.run({ connectionStatus: 'Active' });

        expect(notEmptyResponse).toMatchObject({
            data: [
                {
                    name: 'readername',
                    code: 'readercode',
                    phone: null,
                    connectionStatus: {
                        color : 'yellow',
                        title : 'Init'
                    }
                }
            ]
        });

        expect(emptyResponse).toMatchObject({ data : [] });
    }));
});
