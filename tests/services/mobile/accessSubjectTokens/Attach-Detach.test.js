const AccessSubjectTokensAttach = require('../../../../lib/services/mobile/accessSubjectTokens/AttachWithId');
const AccessSubjectTokensDetach = require('../../../../lib/services/mobile/accessSubjectTokens/Detach');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');

const { registerUser } = require('../user/utils');

const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Mobile: AccessSubjectTokens Attach/Detach', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: attach and detach AccessSubjectTokens', factory.wrapInRollbackTransaction(async () => {
        const { user: { id: userId }, subject: { id: accessSubjectId } } = await registerUser({ password: 'newPassword1@', email: 'email@email.com', workspace: 'workspace' });

        const { data: { id: tokenId } } = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE'
        });

        const attachTokenService = new AccessSubjectTokensAttach({ context: {} });
        const detachTokenService = new AccessSubjectTokensDetach({ context: {} });

        attachTokenService.cls.set('userId', userId);
        detachTokenService.cls.set('userId', userId);

        const attachRes = await attachTokenService.run({
            id: tokenId
        });

        expect(attachRes.data).toMatchObject({
            id: tokenId,
            accessSubjectId: accessSubjectId,
            name: 'tokenname',
            code: 'CODE',
            type: null,
            enabled: true,
            isArchived: false
        });

        const detachRes = await detachTokenService.run({
            id: tokenId
        });

        expect(detachRes).toMatchObject({});
    }));
});
