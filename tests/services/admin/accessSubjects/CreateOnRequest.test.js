const UsersCreateRegistrationRequest = require('../../../../lib/services/mobile/users/CreateRegistrationRequest');
const AccessSubjectsCreateOnRequest  = require('../../../../lib/services/admin/accessSubjects/CreateOnRequest');
const AccessSubjectsCreate           = require('../../../../lib/services/admin/accessSubjects/Create');
const NotificationsList              = require('../../../../lib/services/admin/notifications/List');
const SessionsCreate                 = require('../../../../lib/services/mobile/sessions/Create');
const { ValidationError }            = require('../../../../lib/services/utils/SX');
const TestFactory                    = require('../../../utils');
const [ workspaceFixture ]           = require('../../../fixtures/workspaces');

describe('admin: accessSubjects/CreateOnRequest service', () => {
    const factory = new TestFactory();

    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test(
        'POSITIVE: it should create access subject and mobile user on registration request',
        factory.wrapInRollbackTransaction(async () => {
            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name';
            const email = 'test@test.coms';
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });
            const accessSubjectsCreateOnRequest = new AccessSubjectsCreateOnRequest({ context: {} });
            const sessionsCreateService = new SessionsCreate({ context: {} });

            await usersCreateRegistrationRequestService.run({
                workspace,
                subjectName,
                email,
                phone,
                password,
                passwordConfirm,
                ip
            });

            const resultAccessSubjectsCreateOnRequest = await accessSubjectsCreateOnRequest.run({
                name : subjectName,
                email,
                phone
            });

            expect(resultAccessSubjectsCreateOnRequest).toStrictEqual(expect.objectContaining({
                data : expect.objectContaining({
                    name : subjectName,
                    email,
                    phone
                })
            }));

            const sessionsCreateResult = await sessionsCreateService.run({
                workspace,
                email,
                password : 'fake-password',
                ip
            });

            expect(sessionsCreateResult).toStrictEqual({
                data : {
                    accessSubject : expect.objectContaining({
                        name : subjectName,
                        email,
                        phone
                    }),
                    jwt : expect.any(String)
                }
            });
            expect(sessionsCreateResult.data.jwt.length).toBeGreaterThan(0);
        })
    );

    test(
        'POSITIVE: it should create access subject and update notification after subject created',
        factory.wrapInRollbackTransaction(async () => {
            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name1';
            const email = 'test1@test.coms';
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });
            const accessSubjectsCreateOnRequest = new AccessSubjectsCreateOnRequest({ context: {} });
            const notificationsListService = new NotificationsList({ context: {} })

            await usersCreateRegistrationRequestService.run({
                workspace,
                subjectName,
                email,
                phone,
                password,
                passwordConfirm,
                ip
            });

            const resultNotificationsBefore = await notificationsListService.run({});

            expect(resultNotificationsBefore).toMatchObject({
                data: [
                    {
                        type: 'USER_REQUEST_REGISTRATION',
                        data: {
                            email: 'test1@test.coms',
                            phone: '+380000000000',
                            subjectName: 'test-subject-name1'
                        },
                        message: 'test-subject-name1 отправил запрос на добавление в рабочее пространство',
                        isRead: false,
                        accessSubject: null,
                        accessSubjectToken: null,
                        accessTokenReader: null
                    }
                ],
                meta: { filteredCount: 1, total: 1, unreadTotal: 1 }
           });

            const resultAccessSubjectsCreateOnRequest = await accessSubjectsCreateOnRequest.run({
                name : subjectName,
                email,
                phone
            });

            expect(resultAccessSubjectsCreateOnRequest).toStrictEqual(expect.objectContaining({
                data : expect.objectContaining({
                    name : subjectName,
                    email,
                    phone
                })
            }));

            const resultNotificationsAfter = await notificationsListService.run({});

            expect(resultNotificationsAfter).toMatchObject({
                data: [
                    {
                        type: 'USER_REQUEST_REGISTRATION',
                        data: {
                            email: 'test1@test.coms',
                            phone: '+380000000000',
                            subjectName: 'test-subject-name1'
                        },
                        message: 'test-subject-name1 отправил запрос на добавление в рабочее пространство',
                        isRead: false,
                        accessSubject:  {
                            email: 'test1@test.coms',
                            fullName: 'test-subject-name1'
                        },
                        accessSubjectToken: null,
                        accessTokenReader: null
                    }
                ],
                meta: { filteredCount: 1, total: 1, unreadTotal: 1 }
           });
        })
    );

    test(
        'NEGATIVE: it should throw an error when subject with current email is already created',
        factory.wrapInRollbackTransaction(async () => {
            expect.hasAssertions();

            const subjectName = 'test-subject-name';
            const email = 'test@test.coms';
            const phone = '+380000000000';
            const accessSubjectsCreateOnRequest = new AccessSubjectsCreateOnRequest({ context: {} });
            const accessSubjectsCreate = new AccessSubjectsCreate({ context: {} });

            await accessSubjectsCreate.run({
                name  : subjectName,
                email,
                phone,
                accessSubjectTokenIds : []
            });

            try {
                await accessSubjectsCreateOnRequest.run({
                    name : subjectName,
                    email,
                    phone
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.SUBJECT_EMAIL_IS_USED);
                expect(err.errors).toEqual([ { message: 'Subject email is used', field: 'email' } ]);
            }
        })
    );

    test(
        'NEGATIVE: it should throw an error when subject with current phone number exists',
        factory.wrapInRollbackTransaction(async () => {
            expect.hasAssertions();

            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name';
            const email = 'test@test.coms';
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });
            const accessSubjectsCreate = new AccessSubjectsCreate({ context: {} });
            const accessSubjectsCreateOnRequest = new AccessSubjectsCreateOnRequest({ context: {} });

            await usersCreateRegistrationRequestService.run({
                workspace,
                subjectName,
                email,
                phone,
                password,
                passwordConfirm,
                ip
            });

            // Create subject with same phone number but another email
            await accessSubjectsCreate.run({
                name  : subjectName,
                email : 'another-fake-email@test.coms',
                phone,
                accessSubjectTokenIds : []
            });

            try {
                await accessSubjectsCreateOnRequest.run({
                    name : subjectName,
                    email,
                    phone
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.SUBJECT_PHONE_IS_USED);
                expect(err.errors).toEqual([ { message: 'Subject phone is used', field: 'phone' } ]);
            }
        })
    );

    test(
        'NEGATIVE: it should throw an error when there is no registration request for current subject',
        factory.wrapInRollbackTransaction(async () => {
            expect.hasAssertions();

            const subjectName = 'test-subject-name';
            const email = 'test@test.coms';
            const phone = '+380000000000';
            const accessSubjectsCreateOnRequest = new AccessSubjectsCreateOnRequest({ context: {} });

            try {
                await accessSubjectsCreateOnRequest.run({
                    name : subjectName,
                    email,
                    phone
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.REGISTRATION_REQUEST_NOT_FOUND);
                expect(err.errors).toEqual([ { message: 'Registration request not found', field: 'email' } ]);
            }
        })
    );
});
