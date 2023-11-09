const Base = require('./BaseSeed');
const User = require('../lib/models/User');

class UserSeed extends Base {
    async createEntity({ related: { workspace } }) {
        return User.create({
            name: this.faker.getRandomName(),
            workspaceId: workspace.id,
            email: this.faker.getRandomEmail(),
            password: 'fake1234',
            mqttToken: 'faker1234'
        });
    }
};

module.exports = new UserSeed();