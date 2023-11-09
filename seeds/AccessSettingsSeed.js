const Base = require('./BaseSeed');
const AccessSchedule = require('../lib/models/AccessSchedule');
const AccessSetting = require('../lib/models/AccessSetting');
const sequelize = require('../lib/sequelizeSingleton');

class AccessSettingSeed extends Base {
    async createEntity({ related: { accessReaderGroup, accessSubject, accessTokenReader, workspace } }) {
        const accessSchedule = await AccessSchedule.findOne();

        let accessSetting = null;
        await sequelize.transaction(async transaction => {
            accessSetting = await AccessSetting.create({ workspaceId: workspace.id }, { transaction });
            await accessSetting.setAccessReadersGroups([ accessReaderGroup.id ], { transaction });
            await accessSetting.setAccessTokenReaders([ accessTokenReader.id ], { transaction });
            await accessSetting.setAccessSchedules([ accessSchedule.id ], { transaction });
            await accessSetting.setAccessSubjects([ accessSubject.id ], { transaction });
            await accessSetting.updateReaderTokens({ transaction });
        });

        return accessSetting;
    }
};

module.exports = new AccessSettingSeed();