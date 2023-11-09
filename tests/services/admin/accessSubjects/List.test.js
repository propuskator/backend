const AccessSubjectsList = require('../../../../lib/services/admin/accessSubjects/List');
const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjects List', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: list AccessSubjects', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSubjectTokensCreate = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE',
            // type: 'NFC'
        });
        await (new AccessSubjectsCreate({ context: {} })).run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            sendInvitation : false,
            accessSubjectTokenIds: [resultAccessSubjectTokensCreate.data.id]
        });
        const service = new AccessSubjectsList({ context: {} });
        const res = await service.run({});

        expect(res).toMatchObject({
            data: [
                {
                    name  : 'name',
                    position  : 'position',
                    email  : 'email@email.com',
                    phone  : '+380000000000',
                    phoneEnabled : false,
                    isInvited : false,
                    accessSubjectTokens:[
                        {
                            code: 'CODE',
                            // type: 'NFC'
                        }
                    ]
                }
            ]
        });
    }));
});
