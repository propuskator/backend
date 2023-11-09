const AccessTokenReadersDelete = require('../../../../lib/services/admin/accessTokenReaders/Delete');
const AccessTokenReadersList = require('../../../../lib/services/admin/accessTokenReaders/List');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessTokenReaders Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        const resultAccessTokenReadersCreate = await (new AccessTokenReadersCreate({ context: {} })).run({
            name: "readername",
            code: 'readercode'
        });

        const res = await (new AccessTokenReadersDelete({ context: {} })).run({
            id: resultAccessTokenReadersCreate.data.id
        });

        expect(res).toMatchObject({
            id: resultAccessTokenReadersCreate.data.id
        });

        const resultAccessTokenReadersList = await (new AccessTokenReadersList({ context: {} })).run({});

        
        expect(resultAccessTokenReadersList).toMatchObject({
            data:[]
        });
        expect(resultAccessTokenReadersList.data.length).toBe(0);
    }));
});
