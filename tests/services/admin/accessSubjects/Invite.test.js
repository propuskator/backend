const AccessSubjectsInvite = require('../../../../lib/services/admin/accessSubjects/Invite');
const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Admin AccessSubjects Invite', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: invite access subject', factory.wrapInRollbackTransaction(async () => {
        const { data: { id: newAccessSubjectId, isInvited }} = await (new AccessSubjectsCreate({ context: {} })).run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            sendInvitation : false,
        });

        expect(isInvited).toEqual(false);

        const res = await (new AccessSubjectsInvite({ context: {} })).run({
            id : newAccessSubjectId
        });

        expect(res).toMatchObject({
            data: {
                name  : 'name',
                position  : 'position',
                fullName  : 'name (position)',
                phoneEnabled  : false,
                email  : 'email@email.com',
                phone  : '+380000000000',
                isInvited : true
            }
        });
    }));
});
