const Base = require('./BaseSeed');
const Workspace = require('../lib/models/Workspace');

class WorkspaceSeed extends Base {
    async createEntity() {
        return Workspace.create({
            name: this.faker.getRandomName()
        })
    }
}
module.exports = new WorkspaceSeed();