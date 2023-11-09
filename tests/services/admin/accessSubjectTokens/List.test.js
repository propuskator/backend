const AccessSubjectTokensList = require('../../../../lib/services/admin/accessSubjectTokens/List');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessSubjectTokens', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSubjectTokensCreate = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE'
        });
        const service = new AccessSubjectTokensList({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            data: [
                {
                    code: 'CODE'
                }
            ]
        });
    }));
});
