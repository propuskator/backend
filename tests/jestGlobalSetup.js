process.env.MODE = 'test';

async function setMaxConnections() {
    console.log('Set maximum connections');
    const Sequelize = require('sequelize');
    const { rootPassword, dialect, host, port } = require('../lib/config')['test-db'];
    const sequelize = new Sequelize({
        username       : 'root',
        password       : rootPassword,
        host,
        port,
        dialect,
        logging        : false,
        dialectOptions : {
            'supportBigNumbers' : true,
            'bigNumberStrings'  : true
        }
    });
    await sequelize.query(`SET GLOBAL max_connections = 500;`,
        { raw: true, logging: console.log }
    );
    await sequelize.close()
}
async function CreateTestDb() {
    console.log('Creating test database');
    const Sequelize = require('sequelize');
    const { database, rootPassword, username, password, dialect, host, port } = require('../lib/config')['test-db'];
    const sequelize = new Sequelize({
        username       : 'root',
        password       : rootPassword,
        host,
        port,
        dialect,
        logging        : false,
        dialectOptions : {
            'supportBigNumbers' : true,
            'bigNumberStrings'  : true
        }
    });
    console.log('CreateTestDb 1');
    const { escape } = require('sequelize/lib/sql-string');// because we need a special quotes
    // eslint-disable-next-line func-style
    const esc = (val) => {
        return escape(val, null, sequelize.options.dialect, true).slice(1, -1);
    };

    await sequelize.authenticate();
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${esc(database)}\``,
        { raw: true, logging: console.log }
    );
    await sequelize.query(`GRANT ALL PRIVILEGES ON \`${esc(database)}\`.* TO \`${esc(username)}\`@'%' IDENTIFIED BY '${esc(password)}'`,
        { raw: true, logging: console.log }
    );
    await sequelize.close()
    console.log('CreateTestDb 2');
}
async function clearDb() {
    const sequelize = global.__SEQUELIZE__;
    const models = require('./../lib/models');

    await sequelize.transaction(async (transaction) => {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { transaction });
        for(const Model of Object.values(models)) await Model.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { transaction });
    })
}
async function CheckAndCreateTestDb() {
    const sequelize = global.__SEQUELIZE__;

    await CreateTestDb();
    await sequelize.authenticate();
}
async function runMigraion() {
    console.log('Rum migration');
    const path = require('path');
    const { spawn } = require('child_process');
    const Promise = require('bluebird');

    return new Promise((resolve, reject) => {
        console.log(path.resolve('..'));
        const proc = spawn('npm', [ 'run', 'migration:test' ], { cwd: path.resolve('.') });

        proc.stdout.on('data', data => console.log(data.toString()));
        proc.stderr.on('data', data => console.log(data.toString()));

        proc.on('error', (err) => {
            reject(err);
            // eslint-disable-next-line no-param-reassign
            resolve = reject = () => {};
        });
        proc.on('exit', (code) => {
            if (code === null || code === 0) {
                resolve();
            } else {
                reject(new Error(`Migration ended with code ${code}`));
            }
            // eslint-disable-next-line no-param-reassign
            resolve = reject = () => {};
        });
    });
}

// eslint-disable-next-line func-names, import/no-commonjs
module.exports = async function () {
    if (process.env.TEST_MODE === 'unit') return; // ignore global setup for unit tests

    const sequelize = require('./../lib/sequelize.js');

    global.__SEQUELIZE__ = sequelize;
    // await setMaxConnections();
    await CheckAndCreateTestDb();
    await runMigraion();
    // await clearDb();
};
