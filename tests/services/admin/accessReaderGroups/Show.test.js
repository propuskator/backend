const AccessReaderGroupsShow = require('../../../../lib/services/admin/accessReaderGroups/Show');
const AccessReaderGroupsCreate = require('../../../../lib/services/admin/accessReaderGroups/Create');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessReaderGroups Show', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: show AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        let resultAccessTokenReadersCreate = await(new AccessTokenReadersCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        })
        let resultAccessReaderGroupsCreate = await(new AccessReaderGroupsCreate({ context: {} })).run({
            name: "groupname",
            accessTokenReaderIds: [resultAccessTokenReadersCreate.data.id]
        })

        const service = new AccessReaderGroupsShow({ context: {} });
        const res = await service.run({ id:resultAccessReaderGroupsCreate.data.id });

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
