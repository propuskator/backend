const models            = require('../../lib/models');
const sequelize         = require('../../lib/sequelize');
const cls               = require('../../lib/cls');
const AccessTokenReader = require('../../lib/models/AccessTokenReader');
const [ mainWorkspace ] = require('../fixtures/workspaces.js');
const [ adminUser ]     = require('../fixtures/adminUsers.js');

class TestFactory {
    constructor() {
        if (process.env.MODE !== 'test') throw new Error('Wrong mode');
        if (!sequelize.config.database.match(/test/i)) throw new Error(`DATABASE [${sequelize.config.database}] DOES NOT HAVE "test" IN ITS NAME`);
        this.cls = cls;
        this.clsContext = this.cls.createContext();
    }

    async init() {
        this.transaction = await sequelize.transaction();
    }

    async cleanup1() {
        await sequelize.transaction(async (transaction) => {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { transaction });
            for(const Model of Object.values(models)) await Model.truncate();
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { transaction });
        })
    }

    wrapInTransaction(f) {
        return this.bindToContext(async () => {
            try {
                if (!this.transaction) await this.init();
                // this.cls.set('transaction', this.transaction);
                await sequelize.transaction({  transaction: this.transaction }, f);
            } catch(e) {
                console.log(e);
                throw e;
            }
        })
    }
    bindToContext(f) {
        return this.cls.bind(f, this.clsContext);
    }
    async runInTransaction(f) {
        let res;
        await this.wrapInTransaction(async () => res = await f())();
        return res;
    }
    async runInContext(f) {
        let res;
        await this.bindToContext(async () => res = await f())();
        return res;
    }

    wrapInRollbackTransaction(f) {
        return this.bindToContext(async () => {
            try {
                // this.cls.set('transaction', this.transaction);
                await sequelize.transaction({ transaction: this.transaction }, async () => {
                    await f();
                    throw new Error('ROLLBACK');
                });
            } catch(e) {
                if (((e instanceof Error) && e.message !== 'ROLLBACK')) {
                    console.log(e);
                    throw e;
                }
            }
        });
    }
    async initializeWorkspace({ workspace = mainWorkspace.name, login = adminUser.login, password = adminUser.password, ip = '192.168.1.1' } = {}) {
        await this.runInContext(async () => {
            const { adminUser } = await this.runInTransaction(async () => {
                const AdminUsersRegister = require('../../lib/services/admin/adminUsers/Register');
                const SessionsCreate = require('../../lib/services/admin/sessions/Create');
                const SessionsCheck = require('../../lib/services/admin/sessions/Check');
                const ser = new AdminUsersRegister({ context: {} });
                await ser.run({
                    workspace, login, password,
                    passwordConfirm : password
                });
                const { data: { jwt } } = await (new SessionsCreate({ context: {} })).run({
                    login, password, ip
                });
                return await (new SessionsCheck({ context: {} })).run({ token : jwt });
            });
            this.cls.set('userId', adminUser.id);
            this.cls.set('workspaceId', adminUser.workspaceId);
        });
    }

    async end() {
        if (this.transaction) {
            await this.transaction.rollback();
        }
        await sequelize.close();
    }
}

module.exports = TestFactory;
