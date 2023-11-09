const Base = require('./BaseSeed');
const AccessSubjectToken = require('../lib/models/AccessSubjectToken')

class AccessSubjectTokenSeed extends Base {
    async createEntity({ related: { workspace, accessSubject } }) {
        return AccessSubjectToken.create({
            workspaceId     : workspace.id,
            name            : this.faker.getRandomName(),
            code            : this.faker.getRandomCode(),
            enabled         : true,
            accessSubjectId : accessSubject.id,
            type            : Math.random() > 0.5 ? AccessSubjectToken.TYPE_NFC : AccessSubjectToken.TYPE_RFID,
            assignedAt      : Date.now()
        })
    }
};

module.exports = new AccessSubjectTokenSeed();