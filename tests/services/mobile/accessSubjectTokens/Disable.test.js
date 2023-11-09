const AccessSubjectTokensDisable = require('../../../../lib/services/mobile/accessSubjectTokens/Disable');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('mobile: AccessSubjectTokens Disable', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: disable AccessSubjectTokens', factory.wrapInRollbackTransaction(async () => {
        const accessSubjectToken = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE'
        });

        const res = await (new AccessSubjectTokensDisable({ context: {} })).run({
            id: accessSubjectToken.data.id,
        });;

        expect(res).toMatchObject({
            data: {
                enabled: false
            }
        });
    }));
});
