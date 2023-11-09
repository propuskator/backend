const AccessSubjectTokensBulkCreate = require('../../../../lib/services/admin/accessSubjectTokens/BulkCreate');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSubjectTokens bulk create', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: bulk create AccessSubjectTokens', factory.wrapInRollbackTransaction(async () => {
        await (new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname1',
            code: 'CODE1'
        });
        const service = new AccessSubjectTokensBulkCreate({ context: {} });
        const res = await service.run({
            data: [{
                name: 'tokenname1',
                code: 'CODE1'
            }, {
                name: 'tokenname2',
                code: 'CODE12'
            }
        ]});

        expect(res).toMatchObject({
            data: [
                {
                    name: 'tokenname1',
                    code: 'CODE1'
                },
                {
                    name: 'tokenname2',
                    code: 'CODE12'
                }
            ],
            meta: {
                createdQuant: 1,
                updatedQuant: 1
            }
        });
    }));
    test('NEGATIVE: bulk create AccessSubjectTokens should return validation error',
        factory.wrapInRollbackTransaction(async () => {
            const service = new AccessSubjectTokensBulkCreate({ context: {} });

            try {
                await service.run({
                    data: [{
                        code: 'CODE2'
                    }]
                });
            } catch (e) {
                expect(e.code).toEqual('FORMAT_ERROR');
            }
    }));
    test('NEGATIVE: bulk create AccessSubjectTokens should return `already exists` error',
        factory.wrapInRollbackTransaction(async () => {
            const service = new AccessSubjectTokensBulkCreate({ context: {} });
            await service.run({
                data: [{
                    name: 'tokenname1',
                    code: 'CODE1'
                }]
            });

            try {
                await service.run({
                    data: [{
                        name: 'tokenname1',
                        code: 'CODE1'
                    }]
                });
            } catch (e) {
                expect(e.type).toEqual('validation');
                expect(e.code).toEqual('TOKEN_CODE_IS_USED');
            }
    }));
    
});
