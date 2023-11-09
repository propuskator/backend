const UsersCreateRegistrationRequest = require('../../../../lib/services/mobile/users/CreateRegistrationRequest');
const AccessSubjectsCreate           = require('../../../../lib/services/admin/accessSubjects/Create');
const UsersRegister                  = require('../../../../lib/services/mobile/users/Register');
const NotificationsList              = require('../../../../lib/services/admin/notifications/List');
const { ValidationError }            = require('../../../../lib/services/utils/SX');
const TestFactory                    = require('../../../utils');
const [ workspaceFixture ]           = require('../../../fixtures/workspaces');
const [ accessSubjectFixture ]       = require('../../../fixtures/accessSubjects');

describe('mobile: users/CreateRegistrationRequest service', () => {
    const factory = new TestFactory();

    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test(
        'POSITIVE: it should create registration request and notification about it',
        factory.wrapInRollbackTransaction(async () => {
            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name';
            const email = 'test@test.coms';
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });
            const notificationsListService = new NotificationsList({ context: {} });

            const resultCreateRegistrationRequest = await usersCreateRegistrationRequestService.run({
                workspace,
                subjectName,
                email,
                phone,
                password,
                passwordConfirm,
                ip
            });
            const resultNotificationsList = await notificationsListService.run({ context: {} });

            expect(resultCreateRegistrationRequest).toStrictEqual({});
            expect(resultNotificationsList).toHaveProperty('data');
            expect(resultNotificationsList.data).toContainEqual(expect.objectContaining({
                type        : 'USER_REQUEST_REGISTRATION',
                data        : { subjectName, phone, email },
                message     : `${subjectName} отправил запрос на добавление в рабочее пространство`
            }));
        })
    );

    test(
        'NEGATIVE: it should throw an error when workspace is not found',
        factory.wrapInRollbackTransaction(async () => {
            expect.hasAssertions();

            const workspace = 'fakeworkspace';
            const subjectName = 'test-subject-name';
            const email = 'test@test.coms';
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });

            try {
                await usersCreateRegistrationRequestService.run({
                    workspace,
                    subjectName,
                    email,
                    phone,
                    password,
                    passwordConfirm,
                    ip
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.WORKSPACE_NOT_FOUND);
                expect(err.errors).toEqual([
                    {
                        message : 'Workspace not found',
                        field   : 'workspace'
                    }
                ]);
            }
        })
    );

    test(
        'NEGATIVE: it should throw an error when subject with current email already exists',
        factory.wrapInRollbackTransaction(async () => {
            expect.hasAssertions();

            await new AccessSubjectsCreate({ context: {} }).run({
                name                  : accessSubjectFixture.name,
                position              : accessSubjectFixture.position,
                email                 : accessSubjectFixture.email,
                phone                 : accessSubjectFixture.phone,
                mobileEnabled         : accessSubjectFixture.mobileEnabled,
                accessSubjectTokenIds : []
            });

            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name';
            const email = accessSubjectFixture.email; // email of the already existed subject
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });

            try {
                await usersCreateRegistrationRequestService.run({
                    workspace,
                    subjectName,
                    email,
                    phone,
                    password,
                    passwordConfirm,
                    ip
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.REGISTRATION_REQUEST_SUBJECT_IS_ALREADY_CREATED);
                expect(err.message).toBe('You are already added to the workspace. Please, complete the common registration');
            }
        })
    );

    test(
        'NEGATIVE: it should throw an error when mobile user with current email already exists',
        factory.wrapInRollbackTransaction(async () => {
            expect.hasAssertions();

            await new AccessSubjectsCreate({ context: {} }).run({
                name                  : accessSubjectFixture.name,
                position              : accessSubjectFixture.position,
                email                 : accessSubjectFixture.email,
                phone                 : accessSubjectFixture.phone,
                mobileEnabled         : accessSubjectFixture.mobileEnabled,
                accessSubjectTokenIds : []
            });
            await new UsersRegister({ context: {} }).run({
                workspace       : workspaceFixture.name,
                email           : accessSubjectFixture.email,
                password        : 'fake-password',
                passwordConfirm : 'fake-password'
            });

            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name';
            const email = accessSubjectFixture.email; // email of the already existed subject
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });

            try {
                await usersCreateRegistrationRequestService.run({
                    workspace,
                    subjectName,
                    email,
                    phone,
                    password,
                    passwordConfirm,
                    ip
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.REGISTRATION_REQUEST_SUBJECT_EMAIL_IS_ALREADY_REGISTERED);
                expect(err.errors).toEqual([
                    {
                        message : 'Email is already registered, try to authorize',
                        field   : 'email'
                    }
                ]);
            }
        })
    );
});
