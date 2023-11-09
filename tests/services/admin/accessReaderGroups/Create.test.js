const AccessReaderGroupsCreate = require('../../../../lib/services/admin/accessReaderGroups/Create');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessReaderGroups Create', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        let resultAccessTokenReadersCreate = await(new AccessTokenReadersCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        })
        const service = new AccessReaderGroupsCreate({ context: {} });
        const res = await service.run({
            name: "groupname",
            accessTokenReaderIds: [resultAccessTokenReadersCreate.data.id]
        });

        expect(res).toMatchObject({
            data: {
                name: "groupname",
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
