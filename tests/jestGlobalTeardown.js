/* eslint-disable func-names */
// eslint-disable-next-line import/no-commonjs
module.exports = async function () {
    if (process.env.TEST_MODE === 'unit') return; // ignore global teardown for unit tests

    await global.__SEQUELIZE__.close();
};
