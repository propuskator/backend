const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessTokenReaders Create', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessTokenReaders', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessTokenReadersCreate({ context: {} });
        const res = await service.run({
            name: "readername",
            phone: "+380682438956",
            code: 'readercode'
        });

        expect(res).toMatchObject({
            data: {
                name: 'readername',
                code: 'readercode',
                phone: "+380682438956",
                connectionStatus: {
                    color : 'yellow',
                    title : 'Init'
                }
            }
        });
    }));

    test('NEGATIVE: can`t create AccessTokenReaders with existing phone', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessTokenReadersCreate({ context: {} });
        await service.run({
            name: "readername",
            phone: "+380682438956",
            code: 'readercode'
        });

        try {
            await service.run({
                name: "readername",
                phone: "+380682438956",
                code: 'readercode2'
            });
        } catch (e) {
            expect(e.type).toEqual('validation');
            expect(e.code).toEqual('READER_PHONE_IS_USED');
        }
    }));
});
