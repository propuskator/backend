const AccessSubjectTokensUpdate = require('../../../../lib/services/admin/accessSubjectTokens/Update');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens Update', () => {
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
        const service = new AccessSubjectTokensUpdate({ context: {} });
        const res = await service.run({
            id:resultAccessSubjectTokensCreate.data.id,
            code: 'CODE2'
        });

        expect(res).toMatchObject({
            data: {
                code: 'CODE2'
            }
        });
    }));
});
