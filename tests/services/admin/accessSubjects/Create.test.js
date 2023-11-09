const AccessSubjectsCreate      = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const Workspace                 = require('../../../../lib/models/Workspace');
const sendInvitationEmail       = require('../../../../lib/services/admin/accessSubjects/utils/sendInvitationEmail');
const TestFactory               = require('../../../utils');

jest.setTimeout(30000);

const factory = new TestFactory();

jest.mock('../../../../lib/services/admin/accessSubjects/utils/sendInvitationEmail', () => jest.fn());

describe('admin AccessSubjects Create', () => {
    const MOCK_LOGGER = {
        warn : jest.fn()
    };

    let service = null;

    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    beforeEach(() => {
        service = new AccessSubjectsCreate({ context: {}});
        
        service.logger = MOCK_LOGGER;
    });

    test('POSITIVE: create AccessSubjects without invite', factory.wrapInRollbackTransaction(async () => {
        const resultAccessSubjectTokensCreate = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE',
            // type: 'NFC'
        });
        const res = await service.run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            phoneEnabled  : true,
            sendInvitation : false,
            accessSubjectTokenIds: [resultAccessSubjectTokensCreate.data.id]
        });

        expect(res).toMatchObject({
            data: {
                name  : 'name',
                position  : 'position',
                fullName  : 'name (position)',
                email  : 'email@email.com',
                phoneEnabled  : true,
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

    test('POSITIVE: should create subject with sending invite', factory.wrapInRollbackTransaction(async () => {
        Workspace.findOne = jest.fn().mockResolvedValue({});

        const res = await service.run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            sendInvitation : true,
        });

        expect(res).toMatchObject({
            data: {
                name  : 'name',
                position  : 'position',
                fullName  : 'name (position)',
                phoneEnabled  : false,
                email  : 'email@email.com',
                phone  : '+380000000000',
                isInvited : true,
            },
            meta : {
                invitationSentSuccessfully : true
            }
        });
    }));


    test(
        'NEGATIVE: should return false invitationSentSuccessfully field when sending invitation fails',
        factory.wrapInRollbackTransaction(async () => {
            Workspace.findOne = jest.fn().mockResolvedValue({});

            sendInvitationEmail.mockRejectedValue(new Error());

            const res = await service.run({
                name  : 'name',
                position  : 'position',
                email  : 'email@email.com',
                phone  : '+380000000000',
                sendInvitation : true,
            });

            expect(res).toMatchObject({
                data: {
                    name  : 'name',
                    position  : 'position',
                    fullName  : 'name (position)',
                    phoneEnabled  : false,
                    email  : 'email@email.com',
                    phone  : '+380000000000',
                    isInvited : true,
                },
                meta : {
                    invitationSentSuccessfully : false
                }
            });
        })
    );

    test('NEGATIVE: can`t create AccessSubjects with existing phone', factory.wrapInRollbackTransaction(async () => {
        await service.run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            sendInvitation : false,
        });

        try {
            await service.run({
                name  : 'name',
                position  : 'position',
                email  : 'email2@email.com',
                phone  : '+380000000000',
                sendInvitation : false,
            });
        } catch (e) {
            expect(e.type).toEqual('validation');
            expect(e.code).toEqual('SUBJECT_PHONE_IS_USED');
        }
    }));
});
