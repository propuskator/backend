const AccessSubjectTokensEnable = require('../../../../lib/services/mobile/accessSubjectTokens/Enable');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Mobile: AccessSubjectTokens Enable', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: enable AccessSubjectTokens', factory.wrapInRollbackTransaction(async () => {
        const accessSubjectToken = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE'
        });

        const res = await (new AccessSubjectTokensEnable({ context: {} })).run({
            id: accessSubjectToken.data.id,
        });;

        expect(res).toMatchObject({
            data: {
                enabled: true
            }
        });
    }));
});
