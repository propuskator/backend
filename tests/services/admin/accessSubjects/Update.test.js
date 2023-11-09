const AccessSubjectsUpdate = require('../../../../lib/services/admin/accessSubjects/Update');
const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjects Update', () => {
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
        const accessSubjectCreateService = new AccessSubjectsCreate({ context: {}});

        accessSubjectCreateService.logger = {
            warn : jest.fn()
        };

        const resultAccessSubjectsCreate = await accessSubjectCreateService.run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phoneEnabled : true,
            sendInvitation : false,
            phone  : '+380000000000'
        });

        expect(resultAccessSubjectsCreate.data.isInvited).toEqual(false);

        const service = new AccessSubjectsUpdate({ context: {} });
        const res = await service.run({
            id:resultAccessSubjectsCreate.data.id,
            name  : 'name2',
            position  : 'position2',
            email  : 'email2@email.com',
            phone  : '+3800000000002',
            phoneEnabled : false,
            accessSubjectTokenIds: [resultAccessSubjectTokensCreate.data.id]
        });

        expect(res).toMatchObject({
            data: {
                name  : 'name2',
                position  : 'position2',
                fullName  : 'name2 (position2)',
                email  : 'email2@email.com',
                phoneEnabled : false,
                phone  : '+3800000000002',
                isInvited : false, // should be false because we changed email
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
