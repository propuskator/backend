const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens Create', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessSubjectTokens', factory.wrapInRollbackTransaction(async () => {
        const service = new AccessSubjectTokensCreate({ context: {} });
        const res = await service.run({
            name: 'tokenname',
            code: 'CODE'
        });

        expect(res).toMatchObject({
            data: {
                code: 'CODE'
            }
        });
    }));
});
