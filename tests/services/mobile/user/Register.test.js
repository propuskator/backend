const { default: AccessSubject } = require('../../../../lib/models/AccessSubject');
const ListNotifications          = require('../../../../lib/services/admin/notifications/List');
const UsersRegister              = require('../../../../lib/services/mobile/users/Register');
const TestFactory                = require('../../../utils');
const [ accessSubject ]          = require('../../../fixtures/accessSubjects');
const [ workspace ]              = require('../../../fixtures/workspaces');
const [ user ]                   = require('../../../fixtures/users');

const { registerUser } = require('./utils');

jest.setTimeout(30000);
const factory = new TestFactory();
const testEmail = 'test-email@test.com';

describe('mobile User Register', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: should return user, subject and token on registration', factory.wrapInRollbackTransaction(async () => {
        const {
            user,
            subject,
            token
        } = await registerUser({ password: 'newPassword1@', email: testEmail, workspace: 'workspace' });

        expect(token).toBeDefined();
        [
            'id',
            'email',
            'createdAt',
            'updatedAt'
        ].forEach(p => expect(user).toHaveProperty(p));
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
        ].forEach(p => expect(subject).toHaveProperty(p))
    }));

    // this functionality is required by the mobile app to have backward compatibily
    // with older versions of it
    test(
        'POSITIVE: should return email in "data" object after successful registration', 
        factory.wrapInRollbackTransaction(async () => {
            await AccessSubject.create(accessSubject);

            const result = await new UsersRegister({ context: {} }).run({
                workspace       : workspace.name,
                email           : user.email,
                password        : 'fake-password',
                passwordConfirm : 'fake-password'
            });

            expect(result).toMatchObject({
                data : {
                    email : user.email
                }
            });
        })
    );

    test('POSITIVE: receive notification about registration', factory.wrapInRollbackTransaction(async () => {
        await registerUser({ password: 'newPassword1@', email: testEmail, workspace: 'workspace' });
        
        const { data: [ notification ] } = await new ListNotifications({ context: {} }).run({});

        expect(notification.type).toEqual('ACCESS_SUBJECT_REGISTRATION');
    }));
});
