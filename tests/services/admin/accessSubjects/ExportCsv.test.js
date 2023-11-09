const AccessSubjectCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const ExportCsv = require('../../../../lib/services/admin/accessSubjectTokens/ExportCsv');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubject Export Csv', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: get path to csv file', factory.wrapInRollbackTransaction(async () => {
        const tokens = await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE',
        });

        await new AccessSubjectCreate({ context: {} }).run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            sendInvitation : false,
            accessSubjectTokenIds: [tokens.data.id]
        });

        const path = await new ExportCsv({ context: {} }).run({});

        expect(typeof path === 'string').toEqual(true);
    }));

    test('NEGATIVE: can`t export access subjects if db is empty', factory.wrapInRollbackTransaction(async () => {
        try {
            await new ExportCsv({ context: {} }).run({});
        } catch (e) {
            expect(e.type).toEqual('notFound');
            expect(e.code).toEqual('CANNOT_FIND_MODEL');
        }
    }));
});
