const AccessSubjectsShow = require('../../../../lib/services/admin/accessSubjects/Show');
const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjects Show', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create AccessSubjects', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSubjectTokensCreate = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE',
            // type: 'NFC'
        });
        const resultAccessSubjectsCreate = await (new AccessSubjectsCreate({ context: {} })).run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            sendInvitation : false,
            accessSubjectTokenIds: [resultAccessSubjectTokensCreate.data.id]
        });
        const service = new AccessSubjectsShow({ context: {} });
        const res = await service.run({
            id:resultAccessSubjectsCreate.data.id
        });

        expect(res).toMatchObject({
            data: {
                name  : 'name',
                position  : 'position',
                fullName  : 'name (position)',
                email  : 'email@email.com',
                phoneEnabled : false,
                phone  : '+380000000000',
                isInvited : false,
                accessSubjectTokens:[
                    {
                        code: 'CODE',
                        // type: 'NFC'
                    }
                ]
            }
        });
    }));
});
