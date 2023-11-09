const Base = require('./BaseSeed');
const AdminUser = require('../lib/models/AdminUser');

class AdminUserSeed extends Base {
    async createEntity({ related: { workspace } }) {
        return AdminUser.create({
            workspaceId: workspace.id,
            login: this.faker.getRandomEmail(),
            password: 'test1234',
            mqttToken: 'test1234'
        });
    }
};

module.exports = new AdminUserSeed();