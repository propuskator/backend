const CreateOrUpdate = require('../../../../lib/services/mobile/usersAccessTokenReaders/UpdateOrCreate');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const { registerUser } = require('../user/utils');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Mobile: userAccessTokenReaders create or update', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create or update userAccessTokenReaders', factory.wrapInRollbackTransaction(async () => {
        const { user: { id: userId }} = await registerUser({ password: 'newPassword1@', email: 'email@email.com', workspace: 'workspace' });
        const { data: { id: readerId } } = await (new AccessTokenReadersCreate({ context: {} })).run({
            name: "name",
            code: "code"
        })

        const createOrUpdateService = new CreateOrUpdate({ context: {} });
        createOrUpdateService.cls.set('userId', userId);
        
        const response = await createOrUpdateService.run({
            accessTokenReaderId: readerId,
            customName: 'some-custom-name'
        });

        expect(response).toMatchObject({
            data: {
                accessTokenReaderId: +readerId,
                customName: 'some-custom-name',
            }
        });
    }));
});
