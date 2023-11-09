const AccessReaderGroupsUpdate = require('../../../../lib/services/admin/accessReaderGroups/Update');
const AccessReaderGroupsCreate = require('../../../../lib/services/admin/accessReaderGroups/Create');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessReaderGroups Update', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: update AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        let resultAccessTokenReadersCreate = await(new AccessTokenReadersCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        })
        let resultAccessReaderGroupsCreate = await(new AccessReaderGroupsCreate({ context: {} })).run({
            name: "groupname"
        })
        const service = new AccessReaderGroupsUpdate({ context: {} });
        const res = await service.run({
            id: resultAccessReaderGroupsCreate.data.id,
            name: "groupname2",
            accessTokenReaderIds: [resultAccessTokenReadersCreate.data.id]
        });

        expect(res).toMatchObject({
            data: {
                name: "groupname2",
                accessTokenReaders : [
                    {
                        name: 'readername',
                        code: 'readercode',
                        connectionStatus: {
                            color : 'yellow',
                            title : 'Init'
                        }
                    }
                ]
            }
        });
    }));
});
