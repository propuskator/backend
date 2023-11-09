require('@babel/register');
require('../lib/sequelize');
const { WORKSPACES_COUNT, WORKSPACES_SIZE } = require('./etc/config');

const workspaceSeed = require('./WorkspaceSeed');
const adminUserSeed = require('./AdminUserSeed');
const accessSubjectSeed = require('./AccessSubjectSeed');
const userSeed = require('./UserSeed');
const accessTokenReaderSeed = require('./AccessTokenReaderSeed');
const accessSubjectTokenSeed = require('./AccessSubjectTokenSeed');
const accessReaderGroupSeed = require('./AccessReaderGroupSeed');
const accessSettingsSeed = require('./AccessSettingsSeed');

(async () => {
    for ( let i = 0; i < WORKSPACES_COUNT; i++ ) {
        const workspace = await workspaceSeed.create();

        await adminUserSeed.create({ related: { workspace } });

        for ( let k = 0; k < WORKSPACES_SIZE; k++ ) {
            const user = await userSeed.create({ related: { workspace }} );
            const accessSubject = await accessSubjectSeed.create({ related: { workspace, user }});
            const accessTokenReader = await accessTokenReaderSeed.create({ related: { workspace }});
            const accessReaderGroup = await accessReaderGroupSeed.create({ related: { workspace }});

            await accessSubjectTokenSeed.create({ related: { workspace, accessSubject }});
            await accessSettingsSeed.create({ related: { accessReaderGroup, accessSubject, accessTokenReader, workspace }});
        }
    }
})();