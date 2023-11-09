
const SessionsCreate = require('../../../../lib/services/admin/sessions/Create');
const TestFactory = require('../../../utils');
const StoredTriggerableAction = require('../../../../lib/models/StoredTriggerableAction');
const { attempt } = require('bluebird');
const { ForbiddenError } = require('../../../../lib/services/utils/SX');
import { attemptsOptions } from '../../../../lib/config';

jest.setTimeout(30000);
const factory = new TestFactory();


let accessToken = null;
describe('admin Sessions Create', () => {
    beforeAll(async () => {
        await factory.runInTransaction(async () => {
            const AdminUsersRegister = require('../../../../lib/services/admin/adminUsers/Register');
            const service = new AdminUsersRegister({ context: {} });
            await service.run({
                workspace    : 'workspace',
                login        : 'adminlogin@gmail.com',
                password     : '2SmartAccess',
                passwordConfirm : '2SmartAccess'
            });
        });
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: create Sessions', factory.wrapInTransaction(async () => {
        const service = new SessionsCreate({ context: {} });
        const res = await service.run({
            login    : 'adminlogin@gmail.com',
            password : '2SmartAccess',
            ip       : '192.168.1.1'
        });

        expect(!!res.data.jwt).toEqual(true);
        accessToken = res.data.jwt;
    }));
    test('POSITIVE: refresh Sessions', factory.wrapInTransaction(async () => {
        const service = new SessionsCreate({ context: {} });
        const res = await service.run({
            token : accessToken
        });

        expect(!!res.data.jwt).toEqual(true);   
    }));

    test('POSITIVE: try to login', factory.wrapInTransaction(async () => {
        jest.spyOn(StoredTriggerableAction, 'findAll');

        const service = new SessionsCreate({ context: {} });
        await service.run({  
            login    : 'adminlogin@gmail.com',
            password : '2SmartAccess',
            ip       : '192.168.1.1'
        });

        expect(StoredTriggerableAction.findAll).toHaveBeenCalledTimes(1);
    }));

    test('POSITIVE: try to login blocked', factory.wrapInTransaction(async () => {
        const storedTriggerableAction = [{
            ip: '192.168.1.1',
            payload:  { attempts: +attemptsOptions.attemptsCount }
        }];
        jest.spyOn(StoredTriggerableAction, 'findAll').mockImplementation(() => storedTriggerableAction);

        const service = new SessionsCreate({ context: {} });

        try{
            await service.run({  
                login    : 'adminlogin@gmail.com',
                password : '2SmartAccess',
                ip       : '192.168.1.1'
            });
        }catch(e){
            expect(e.code).toBe(ForbiddenError.codes.HTTP_TOO_MANY_REQUESTS_FOR_LOGIN);
        }
    }));
});
