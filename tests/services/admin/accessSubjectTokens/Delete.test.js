const AccessSubjectTokensDelete = require('../../../../lib/services/admin/accessSubjectTokens/Delete');
const AccessSubjectTokensList = require('../../../../lib/services/admin/accessSubjectTokens/List');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSubjectTokensCreate = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE'
        });

        const res = await (new AccessSubjectTokensDelete({ context: {} })).run({
            id: resultAccessSubjectTokensCreate.data.id
        });

        expect(res).toMatchObject({
            id: resultAccessSubjectTokensCreate.data.id
        });

        const resultAccessSubjectTokensList = await (new AccessSubjectTokensList({ context: {} })).run({});

        
        expect(resultAccessSubjectTokensList).toMatchObject({
            data:[]
        });
        expect(resultAccessSubjectTokensList.data.length).toBe(0);
    }));
});
