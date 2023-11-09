const Create = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const ExportCsv = require('../../../../lib/services/admin/accessSubjectTokens/ExportCsv');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens Export Csv', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: get path to csv file', factory.wrapInRollbackTransaction(async () => {
        await new Create({ context: {} }).run({
            name: 'tokenname',
            code: 'CODE'
        });

        const path = await new ExportCsv({ context: {} }).run({});

        expect(typeof path === 'string').toEqual(true);
    }));

    test('NEGATIVE: can`t export tokens if db is empty', factory.wrapInRollbackTransaction(async () => {
        try {
            await new ExportCsv({ context: {} }).run({});
        } catch (e) {
            expect(e.type).toEqual('notFound');
            expect(e.code).toEqual('CANNOT_FIND_MODEL');
        }
    }));
});
