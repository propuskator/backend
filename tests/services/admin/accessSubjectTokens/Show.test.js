const AccessSubjectTokensShow = require('../../../../lib/services/admin/accessSubjectTokens/Show');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens Show', () => {
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
        const service = new AccessSubjectTokensShow({ context: {} });
        const res = await service.run({
            id:resultAccessSubjectTokensCreate.data.id
        });

        expect(res).toMatchObject({
            data: {
                code: 'CODE'
            }
        });
    }));
});
