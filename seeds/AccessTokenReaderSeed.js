const Base = require('./BaseSeed');
const AccessTokenReader = require('../lib/models/AccessTokenReader')

class AccessTokenReaderSeed extends Base {
    async createEntity({ related: { workspace } }) {
        return AccessTokenReader.create({
            workspaceId    : workspace.id,
            name           : this.faker.getRandomName(),
            code           : this.faker.getRandomCode(),
            activeAt       : Date.now()
        })
    }
};

module.exports = new AccessTokenReaderSeed();