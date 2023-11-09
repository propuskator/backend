const [ workspace ] = require('./workspaces.js');

module.exports = [
    {
        email       : 'test@mail.com',
        password    : '123456',
        workspaceId : workspace.id
    },
    {
        email       : 'test-2@mail.com',
        password    : '1234567',
        workspaceId : workspace.id
    }
];
