const IssueCreate = require('../../../../lib/services/admin/reportedIssues/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin Create Issue', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create Issue', factory.wrapInTransaction(async () => {
        const service = new IssueCreate({ context: {} });
        const res = await service.run({
            message : 'Something went wrong',
            type    : 'web_app'
        });

        expect(res.data.type).toEqual('web_app');
        expect(res.data.message).toEqual('Something went wrong');
    }));
    test('NEGATIVE: wrong issue type', factory.wrapInTransaction(async () => {
        try {
            const service = new IssueCreate({ context: {} });
            const res = await service.run({
                message : 'Something went wrong',
                type    : 'mobile_app'
            });
    
            expect(res.status).toBe(0);   
        } catch (error) {
            expect(error).toMatchObject({
                fields: { type: 'NOT_ALLOWED_VALUE' },
                code: 'FORMAT_ERROR'
            })
        }
    }));
    test('NEGATIVE: empty message', factory.wrapInTransaction(async () => {
        try {
            const service = new IssueCreate({ context: {} });
            const res = await service.run({
                message : '',
                type    : 'web_app'
            });
    
            expect(res.status).toBe(0);   
        } catch (error) {
            expect(error).toMatchObject({
                fields: { message: 'REQUIRED' },
                code: 'FORMAT_ERROR'
            })
        }
    }));
});
