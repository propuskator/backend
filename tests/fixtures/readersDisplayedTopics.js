const [ , workspace ]         = require('./workspaces');
const [ accessTokenReader ] = require('./accessTokenReaders');

module.exports = [
    {
        workspaceId         : workspace.id,
        accessTokenReaderId : accessTokenReader.id,
        topic               : 'test/topic'
    }
];
