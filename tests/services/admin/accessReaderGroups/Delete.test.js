const AccessReaderGroupsDelete = require('../../../../lib/services/admin/accessReaderGroups/Delete');
const AccessReaderGroupsCreate = require('../../../../lib/services/admin/accessReaderGroups/Create');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessReaderGroups Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        let resultAccessTokenReadersCreate = await(new AccessTokenReadersCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        })
        let resultAccessReaderGroupsCreate = await(new AccessReaderGroupsCreate({ context: {} })).run({
            name: "groupname"
        })
        const service = new AccessReaderGroupsDelete({ context: {} });
        const res = await service.run({
            id: resultAccessReaderGroupsCreate.data.id
        });

        expect(res).toMatchObject({
            id: resultAccessReaderGroupsCreate.data.id
        });
    }));
});
