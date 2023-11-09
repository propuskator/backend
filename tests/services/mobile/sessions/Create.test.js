const UsersCreateRegistrationRequest = require('../../../../lib/services/mobile/users/CreateRegistrationRequest'); const SessionsCreate                 = require('../../../../lib/services/mobile/sessions/Create');
const TestFactory                    = require('../../../utils');
const StoredTriggerableAction        = require('../../../../lib/models/StoredTriggerableAction');
const { registerUser }               = require('../user/utils');
const { ValidationError }            = require('../../../../lib/services/utils/SX');
const { attemptsOptions }            = require('../../../../lib/config');
const [ workspaceFixture ]           = require('../../../fixtures/workspaces');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('mobile User Login', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('POSITIVE: should return subject and jwt on login', factory.wrapInRollbackTransaction(async () => {
        const email = 'adminlogin@gmail.com';
        const workspace = 'workspace';
        const password = '2SmartAccess';

        await registerUser({ email, workspace, password });

        const service = new SessionsCreate({ context: {} });

        const { data } = await service.run({  
            ip: '192.168.1.1',
            workspace,
            email,
            password
        });

        [
            'id',
            'email',
            'name',
            'avatar',
            'workspaceAvatar',
            'fullName',
            'phone',
            'avatarColor',
            'createdAt',
            'updatedAt',
            'canAttachTokens'
        ].forEach(p => expect(data.accessSubject).toHaveProperty(p));

        expect(data).toHaveProperty('jwt');
        expect(typeof data.jwt).toBe('string');
    }));

    test('POSITIVE: try to login', factory.wrapInRollbackTransaction(async () => {
        jest.spyOn(StoredTriggerableAction, 'findAll');

        const service = new SessionsCreate({ context: {} });

        try{
            await service.run({  
                workspace : 'workspace',
                email    : 'adminlogin@gmail.com',
                password : '2SmartAccess',
                ip       : '192.168.1.1'
            });
        }catch(e){
            expect(StoredTriggerableAction.findAll).toHaveBeenCalledTimes(2);
        }
    }));

    test('NEGATIVE: should throw error on login blocked user', factory.wrapInRollbackTransaction(async () => {
        const storedTriggerableAction = [{
            ip: '192.168.1.1',
            payload:  { attempts: +attemptsOptions.attemptsCount }
        }];
        jest.spyOn(StoredTriggerableAction, 'findAll').mockImplementation(() => storedTriggerableAction);

        const service = new SessionsCreate({ context: {} });

        try{
            await service.run({  
                workspace : 'workspace',
                email    : 'adminlogin@gmail.com',
                password : '2SmartAccess',
                ip       : '192.168.1.1'
            });
        }catch(e){
            expect(e.code).toBe(ValidationError.codes.HTTP_TOO_MANY_REQUESTS_FOR_LOGIN);
        }
    }));

    test(
        'POSITIVE: it should throw an error when there is a registration request from a user but it is still processing',
        factory.wrapInRollbackTransaction(async () => {
            const workspace = workspaceFixture.name;
            const subjectName = 'test-subject-name';
            const email = 'test@test.com';
            const phone = '+380000000000';
            const password = 'fake-password';
            const passwordConfirm = 'fake-password';
            const ip = '0.0.0.0';
            const usersCreateRegistrationRequestService = new UsersCreateRegistrationRequest({ context: {} });
            const usersSessionsCreateService = new SessionsCreate({ context: {} });

            await usersCreateRegistrationRequestService.run({
                workspace,
                subjectName,
                email,
                phone,
                password,
                passwordConfirm,
                ip
            });

            try {
                await usersSessionsCreateService.run({
                    workspace,
                    email,
                    password,
                    ip
                });
            } catch (err) {
                expect(err).toBeInstanceOf(ValidationError);
                expect(err.code).toBe(ValidationError.codes.REGISTRATION_REQUEST_IN_PROCESSING);
                expect(err.message).toBe('Registration request in processing');
            }
        })
    );
});