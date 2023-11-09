const [ user1, user2 ] = require('./users');

module.exports = [
    {
        id            : 1,
        name          : 'access-subject-1',
        virtualCode   : 'CODE1',
        email         : user1.email,
        mobileEnabled : true,
        phone         : '+380000000000'
    },
    {
        id            : 2,
        name          : 'access-subject-2',
        virtualCode   : 'CODE2',
        email         : user2.email,
        mobileEnabled : true,
        phone         : '+380000000001'
    }
];
