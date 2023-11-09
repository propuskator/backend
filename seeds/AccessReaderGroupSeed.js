const Base = require('./BaseSeed');
const AccessReadersGroup = require('../lib/models/AccessReadersGroup')

class AccessReadersGroupSeed extends Base {
    async createEntity({ related: { workspace } }) {
        return AccessReadersGroup.create({
            workspaceId    : workspace.id,
            name           : this.faker.getRandomName(),
            color          : 'some fake color'
        })
    }
};

module.exports = new AccessReadersGroupSeed();