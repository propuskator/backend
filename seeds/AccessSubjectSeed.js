const Base = require('./BaseSeed');
const AccessSubject = require('../lib/models/AccessSubject')

class AccessSubjectSeed extends Base {
    async createEntity({ related: { workspace, user } }) {
        return AccessSubject.create({
            workspaceId    : workspace.id,
            userId         : user.id,
            name           : this.faker.getRandomName(),
            enabled        : true,
            position       : 'minister of fake ministry',
            email          : this.faker.getRandomEmail(),
            phone          : this.faker.getRandomPhone(),
            avatar         : this.faker.getRandomImageUrl(),
            avatarColor    : 'fake color',
        })
    }
};

module.exports = new AccessSubjectSeed();