const AccessSubjectsDelete = require('../../../../lib/services/admin/accessSubjects/Delete');
const AccessSubjectsList = require('../../../../lib/services/admin/accessSubjects/List');
const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjects Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
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
        const resultAccessSubjectsList_before = await (new AccessSubjectsList({ context: {} })).run({});
        expect(resultAccessSubjectsList_before).toMatchObject({
            data:[
                {
                    name  : 'name',
                    position  : 'position',
                    email  : 'email@email.com',
                    phone  : '+380000000000',
                    phoneEnabled  : false,
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
        expect(resultAccessSubjectsList_before.data.length).toBe(1);
        const res = await (new AccessSubjectsDelete({ context: {} })).run({
            id: resultAccessSubjectsCreate.data.id
        });

        expect(res).toMatchObject({
            id: resultAccessSubjectsCreate.data.id
        });

        const resultAccessSubjectsList_after = await (new AccessSubjectsList({ context: {} })).run({});

        
        expect(resultAccessSubjectsList_after).toMatchObject({
            data:[]
        });
        expect(resultAccessSubjectsList_after.data.length).toBe(0);
    }));
});
