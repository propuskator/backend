const SessionsCheck = require('../../../../../lib/services/tokenReader/v1/sessions/Check');
const AccessAPISettingsShow = require('../../../../../lib/services/admin/accessAPISettings/Show');
const AccessTokenReadersCreate = require('../../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

let accessTokenReader = null;
describe('tokenReader Sessions Check', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: check Sessions', factory.wrapInRollbackTransaction(async () => {
        const date = new Date();
        const resultAccessAPISettingsShow = await (new AccessAPISettingsShow({ context: {} })).run();
        const resultAccessTokenReadersCreate = await (new AccessTokenReadersCreate({ context: {} })).run({
            name: "readername",
            code: 'readercode'
        });

        const service = new SessionsCheck({ context: {} });
        const res = await service.run({
            code  : 'readercode',
            token : resultAccessAPISettingsShow.data.token
        });

        expect(res.tokenReaderId).toEqual(resultAccessTokenReadersCreate.data.id);
        expect(res.tokenReaderActiveAt > date).toEqual(true);
    }));
});
