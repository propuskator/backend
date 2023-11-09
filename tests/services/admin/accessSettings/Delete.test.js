const AccessSettingsDelete = require('../../../../lib/services/admin/accessSettings/Delete');
const AccessSettingsList = require('../../../../lib/services/admin/accessSettings/List');
const AccessSettingsCreate = require('../../../../lib/services/admin/accessSettings/Create');
const AccessTokenReadersCreate = require('../../../../lib/services/admin/accessTokenReaders/Create');
const AccessReaderGroupsCreate = require('../../../../lib/services/admin/accessReaderGroups/Create');
const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectTokensCreate = require('../../../../lib/services/admin/accessSubjectTokens/Create');
const AccessSchedulesCreate = require('../../../../lib/services/admin/accessSchedules/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('admin AccessSettings Delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete AccessReaderGroups', factory.wrapInRollbackTransaction(async () => {
        let resultAccessTokenReadersCreate = await(new AccessTokenReadersCreate({ context: {} })).run({
            name: 'readername',
            code: 'readercode'
        })
        let resultAccessReaderGroupsCreate = await(new AccessReaderGroupsCreate({ context: {} })).run({
            name: 'groupname',
            accessTokenReaderIds: [resultAccessTokenReadersCreate.data.id]
        })
        let resultAccessSubjectTokensCreate = await(new AccessSubjectTokensCreate({ context: {} })).run({
            name: 'tokenname',
            code: 'CODE',
            // type: 'NFC'
        })
        let resultAccessSubjectsCreate = await(new AccessSubjectsCreate({ context: {} })).run({
            name  : 'name',
            position  : 'position',
            email  : 'email@email.com',
            phone  : '+380000000000',
            accessSubjectTokenIds: [resultAccessSubjectTokensCreate.data.id]
        })
        let resultAccessSchedulesCreate = await(new AccessSchedulesCreate({ context: {} })).run({
            name: "schedulename",
            dates: [
                {
                    from: new Date(1)/1,
                    to: new Date(1)/1
                }
            ]
        })
        const resultAccessSettingsCreate = await (new AccessSettingsCreate({ context: {} })).run({
            accessReadersGroupIds: [resultAccessReaderGroupsCreate.data.id],
            accessTokenReaderIds: [resultAccessTokenReadersCreate.data.id],
            accessScheduleIds: [resultAccessSchedulesCreate.data.id],
            accessSubjectIds: [resultAccessSubjectsCreate.data.id]
        });


        const resultAccessSettingsList_before = await (new AccessSettingsList({ context: {} })).run({});
        expect(resultAccessSettingsList_before).toMatchObject({
            data: [
                {
                    accessTokenReaders : [
                        {
                            name: 'readername',
                            code: 'readercode'
                        }
                    ],
                    accessReadersGroups : [
                        {
                            name: 'groupname'
                        }
                    ],
                    accessSubjects : [
                        {
                            name  : 'name',
                            position  : 'position',
                            email  : 'email@email.com',
                            phone  : '+380000000000'
                        }
                    ],
                    accessSchedules : [
                        {
                            name: "schedulename",
                            dates: [
                                {
                                    from: new Date(1)/1,
                                    to: new Date(1)/1
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        expect(resultAccessSettingsList_before.data.length).toBe(1);


        const service = new AccessSettingsDelete({ context: {} });
        const res = await service.run({
            id: resultAccessSettingsCreate.data.id
        });
        expect(res).toMatchObject({
            id: resultAccessSettingsCreate.data.id
        });


        const resultAccessSettingsList_after = await (new AccessSettingsList({ context: {} })).run({});
        expect(resultAccessSettingsList_after).toMatchObject({
            data:[]
        });
        expect(resultAccessSettingsList_after.data.length).toBe(0);
    }));
});