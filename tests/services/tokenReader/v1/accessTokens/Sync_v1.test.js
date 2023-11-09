const AccessTokensSync = require('../../../../../lib/services/tokenReader/v1/accessTokens/Sync');
const AccessSettingsCreate = require('../../../../../lib/services/admin/accessSettings/Create');
const AccessSettingsUpdate = require('../../../../../lib/services/admin/accessSettings/Update');
const AccessSettingsDelete = require('../../../../../lib/services/admin/accessSettings/Delete');
const AccessTokenReadersCreate = require('../../../../../lib/services/admin/accessTokenReaders/Create');
const AccessTokenReadersUpdate = require('../../../../../lib/services/admin/accessTokenReaders/Update');
const AccessReaderGroupsCreate = require('../../../../../lib/services/admin/accessReaderGroups/Create');
const AccessSubjectsCreate = require('../../../../../lib/services/admin/accessSubjects/Create');
const AccessSubjectsUpdate = require('../../../../../lib/services/admin/accessSubjects/Update');
const AccessSubjectsDelete = require('../../../../../lib/services/admin/accessSubjects/Delete');
const AccessSubjectTokensCreate = require('../../../../../lib/services/admin/accessSubjectTokens/Create');
const AccessSubjectTokensUpdate = require('../../../../../lib/services/admin/accessSubjectTokens/Update');
const AccessSubjectTokensDelete = require('../../../../../lib/services/admin/accessSubjectTokens/Delete');
const AccessSchedulesCreate = require('../../../../../lib/services/admin/accessSchedules/Create');
const AccessSchedulesUpdate = require('../../../../../lib/services/admin/accessSchedules/Update');
const AccessSchedulesDelete = require('../../../../../lib/services/admin/accessSchedules/Delete');
const accessTokenReaders = require('../../../../fixtures/accessTokenReaders');
const accessSubjectTokens = require('../../../../fixtures/accessSubjectTokens');
const accessSubjects = require('../../../../fixtures/accessSubjects');
const accessSchedules = require('../../../../fixtures/accessSchedules');
const accessSchedulesDates = require('../../../../fixtures/accessScheduleDates');
const accessReadersGroups = require('../../../../fixtures/accessReadersGroups');
const TestFactory = require('../../../../utils');

const factory = new TestFactory();

async function createAccessSettingWithRelatedEntities() {
    const [ accessSubject ] = accessSubjects;
    const [ accessTokenReader ] = accessTokenReaders;
    const [ accessSchedule ] = accessSchedules;
    const [ accessScheduleDates ] = accessSchedulesDates;
    const [ accessSubjectToken ] = accessSubjectTokens;
    const resultAccessTokenReadersCreate = await new AccessTokenReadersCreate({ context: {} }).run({
        name : accessTokenReader.name,
        code : accessTokenReader.code
    });
    const resultAccessSubjectTokensCreate = await new AccessSubjectTokensCreate({ context: {} }).run({
        name : accessSubjectToken.name,
        code : accessSubjectToken.code
    });
    const resultAccessSubjectsCreate = await new AccessSubjectsCreate({ context: {} }).run({
        name                  : accessSubject.name,
        position              : accessSubject.position,
        email                 : accessSubject.email,
        phone                 : accessSubject.phone,
        mobileEnabled         : accessSubject.mobileEnabled,
        accessSubjectTokenIds : [ resultAccessSubjectTokensCreate.data.id ]
    });
    const resultAccessSchedulesCreate = await new AccessSchedulesCreate({ context: {} }).run({
        name  : accessSchedule.name,
        dates : [
            {
                weekBitMask        : accessScheduleDates.weekBitMask,
                dailyIntervalStart : accessScheduleDates.dailyIntervalStart,
                dailyIntervalEnd   : accessScheduleDates.dailyIntervalEnd
            }
        ]
    });
    const resultAccessSettingsCreate = await new AccessSettingsCreate({ context: {} }).run({
        accessReadersGroupIds : [],
        accessTokenReaderIds  : [ resultAccessTokenReadersCreate.data.id ],
        accessScheduleIds     : [ resultAccessSchedulesCreate.data.id ],
        accessSubjectIds      : [ resultAccessSubjectsCreate.data.id ]
    });

    return {
        readers   : [ resultAccessTokenReadersCreate.data ],
        tokens    : [ resultAccessSubjectTokensCreate.data ],
        subjects  : [ resultAccessSubjectsCreate.data ],
        schedules : [ resultAccessSchedulesCreate.data ],
        setting   : resultAccessSettingsCreate.data
    };
}

describe('tokenReader AccessTokens Sync', () => {
    beforeEach(async () => {
        await factory.initializeWorkspace();
    });

    afterEach(async () => {
        await factory.runInTransaction(() => factory.cleanup1());
    });

    afterAll(async () => {
        await factory.end();
    });

    // Legacy common test cases
    describe('Common', () => {
        test(
            'POSITIVE: access tokens sync 1',
            factory.wrapInRollbackTransaction(async () => {
                const resultAccessTokenReadersCreate = await new AccessTokenReadersCreate({ context: {} }).run({
                    name : 'readername',
                    code : 'readercode'
                });

                await new AccessReaderGroupsCreate({ context: {} }).run({
                    name                 : 'groupname',
                    accessTokenReaderIds : [ resultAccessTokenReadersCreate.data.id ]
                });

                const resultAccessSubjectTokensCreate = await new AccessSubjectTokensCreate({ context: {} }).run({
                    name : 'nametokentest',
                    code : 'CODE'
                });

                const resultAccessSubjectsCreate = await new AccessSubjectsCreate({ context: {} }).run({
                    name                  : 'name',
                    position              : 'position',
                    email                 : 'email@email.com',
                    phone                 : '+380000000000',
                    mobileEnabled         : false,
                    accessSubjectTokenIds : [ resultAccessSubjectTokensCreate.data.id ]
                });

                const resultAccessSchedulesCreate = await new AccessSchedulesCreate({ context: {} }).run({
                    name  : 'schedulename',
                    dates : [
                        {
                            from : new Date(10 * 60 * 1000) / 1,
                            to   : new Date(20 * 60 * 1000) / 1
                        }
                    ]
                });

                await new AccessSettingsCreate({ context: {} }).run({
                    accessReadersGroupIds : [],
                    accessTokenReaderIds  : [ resultAccessTokenReadersCreate.data.id ],
                    accessScheduleIds     : [ resultAccessSchedulesCreate.data.id ],
                    accessSubjectIds      : [ resultAccessSubjectsCreate.data.id ]
                });

                const date = new Date();
                const result = await new AccessTokensSync({
                    context : {
                        tokenReaderId       : resultAccessTokenReadersCreate.data.id,
                        tokenReaderActiveAt : date
                    }
                }).run({
                    body : '0'
                });

                expect({ str: result }).toEqual({
                    str : `${Math.floor(date / 60000)}%CODE%\n` + 'CODE_/1_10_20'
                });
            })
        );
        test(
            'POSITIVE: access tokens sync 2',
            factory.wrapInRollbackTransaction(async () => {
                const resultAccessTokenReadersCreate = await new AccessTokenReadersCreate({ context: {} }).run({
                    name : 'readername',
                    code : 'readercode'
                });

                await new AccessReaderGroupsCreate({ context: {} }).run({
                    name                 : 'groupname',
                    accessTokenReaderIds : [ resultAccessTokenReadersCreate.data.id ]
                });

                const resultAccessSubjectTokensCreate = await new AccessSubjectTokensCreate({ context: {} }).run({
                    name : 'nametokentest',
                    code : 'CODE'
                });

                const resultAccessSubjectsCreate = await new AccessSubjectsCreate({ context: {} }).run({
                    name                  : 'name',
                    position              : 'position',
                    email                 : 'email@email.com',
                    phone                 : '+380000000000',
                    mobileEnabled         : false,
                    accessSubjectTokenIds : [ resultAccessSubjectTokensCreate.data.id ]
                });

                const resultAccessSchedulesCreate = await new AccessSchedulesCreate({ context: {} }).run({
                    name  : 'schedulename',
                    dates : [
                        {
                            weekBitMask        : [ 0, 0, 0, 1, 1, 1, 1 ],
                            dailyIntervalStart : 60 * 60000,
                            dailyIntervalEnd   : 120 * 60000
                        }
                    ]
                });

                await new AccessSettingsCreate({ context: {} }).run({
                    accessReadersGroupIds : [],
                    accessTokenReaderIds  : [ resultAccessTokenReadersCreate.data.id ],
                    accessScheduleIds     : [ resultAccessSchedulesCreate.data.id ],
                    accessSubjectIds      : [ resultAccessSubjectsCreate.data.id ]
                });

                const date = new Date();
                const result = await new AccessTokensSync({
                    context : {
                        tokenReaderId       : resultAccessTokenReadersCreate.data.id,
                        tokenReaderActiveAt : date
                    }
                }).run({
                    body : '0'
                });

                expect({ str: result }).toEqual({
                    str : `${Math.floor(date / 60000)}%CODE%\n` + 'CODE_/3_60_120_0001111'
                });
            })
        );
        test(
            'POSITIVE: access tokens sync 3',
            factory.wrapInRollbackTransaction(async () => {
                const resultAccessTokenReadersCreate = await new AccessTokenReadersCreate({ context: {} }).run({
                    name : 'readername',
                    code : 'readercode'
                });

                await new AccessReaderGroupsCreate({ context: {} }).run({
                    name                 : 'groupname',
                    accessTokenReaderIds : [ resultAccessTokenReadersCreate.data.id ]
                });

                const resultAccessSubjectTokensCreate = await new AccessSubjectTokensCreate({ context: {} }).run({
                    name : 'nametokentest',
                    code : 'CODE'
                });

                const resultAccessSubjectsCreate = await new AccessSubjectsCreate({ context: {} }).run({
                    name                  : 'name',
                    position              : 'position',
                    email                 : 'email@email.com',
                    phone                 : '+380000000000',
                    mobileEnabled         : false,
                    accessSubjectTokenIds : [ resultAccessSubjectTokensCreate.data.id ]
                });

                const resultAccessSchedulesCreate = await new AccessSchedulesCreate({ context: {} }).run({
                    name  : 'schedulename',
                    dates : [
                        {
                            from               : new Date(10 * 60 * 1000) / 1,
                            to                 : new Date(20 * 60 * 1000) / 1,
                            weekBitMask        : [ 0, 0, 0, 1, 1, 1, 1 ],
                            dailyIntervalStart : 60 * 60000,
                            dailyIntervalEnd   : 120 * 60000
                        }
                    ]
                });

                await new AccessSettingsCreate({ context: {} }).run({
                    accessReadersGroupIds : [],
                    accessTokenReaderIds  : [ resultAccessTokenReadersCreate.data.id ],
                    accessScheduleIds     : [ resultAccessSchedulesCreate.data.id ],
                    accessSubjectIds      : [ resultAccessSubjectsCreate.data.id ]
                });

                const date = new Date();
                const result = await new AccessTokensSync({
                    context : {
                        tokenReaderId       : resultAccessTokenReadersCreate.data.id,
                        tokenReaderActiveAt : date
                    }
                }).run({
                    body : '0'
                });

                expect({ str: result }).toEqual({
                    str : `${Math.floor(date / 60000)}%CODE%\n` + 'CODE_/7_60_120_0001111_10_20'
                });
            })
        );
    });

    // Tests for optimized rules changes creation and syncing them with token readers.
    // Important notes about tests naming for better understanding:
    // Sync service returns response in the next format:
    //     <last update time>%<tokens to delete>%
    //     <tokens' rules to add>
    // Description:
    //     "last update time" - integer, time of last syncing(UNIX timestamp in minutes)
    //     "tokens to delete" - string with comma-separated values, list which contains tokens all rules for which
    //                          should be deleted from firmware's memory
    //     "tokens' rules to add" - string with "\n" separated values, list which contains time rules tokens that
    //                              firmware should save to memory
    describe('Optimized sync flow', () => {
        let reader = null;

        let token = null;

        let subject = null;

        let schedule = null;

        let setting = null;

        let subjectMobileToken = '';

        let subjectPhoneToken = '';

        beforeEach(async () => {
            // Use runInTransaction method for 2 reasons:
            // 1) Bind context for CLS to have access to it in models' methods
            // 2) Run each query in transaction
            await factory.runInTransaction(async () => {
                const {
                    readers,
                    tokens,
                    subjects,
                    schedules,
                    setting: createdSetting
                } = await createAccessSettingWithRelatedEntities();

                [ reader ] = readers;
                [ token ] = tokens;
                [ subject ] = subjects;
                [ schedule ] = schedules;
                setting = createdSetting;
                subjectMobileToken = `sbj-${subject.virtualCode}`;
                subjectPhoneToken = `phn-${subject.virtualCode}`;
            });
        });

        // Tests that are related to changing access settings that causes changing of rules that
        // Sync service returns
        describe('Access settings', () => {
            test(
                "POSITIVE: it should return all subjects' tokens to delete for token reader from access setting " +
                'when delete access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    await new AccessSettingsDelete({ context: {} }).run({
                        id : setting.id
                    });

                    const tokenReaderActiveAt = new Date();
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                "POSITIVE: it should return all subjects' tokens to delete for token reader from access setting " +
                'when disable access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const tokenReaderActiveAt = new Date();

                    // disable access setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id      : setting.id,
                        enabled : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all rules(both tokens to delete and rules to add) for token reader from ' +
                'access setting when enable disabled access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100`, `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;
                    const tokenReaderActiveAt = new Date();

                    // disable access setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id      : setting.id,
                        enabled : false
                    });
                    // enable after disabling
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id      : setting.id,
                        enabled : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                "POSITIVE: it should return all subjects' tokens to delete for token reader from access setting " +
                'when hide access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const tokenReaderActiveAt = new Date();

                    // hide access setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id         : setting.id,
                        isArchived : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return response with no changes for token reader from access setting ' +
                'when show hidden access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTimeInitSync ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemoveInitChanges = `${+lastUpdateTimeInitSync + 1}`;

                    // hide access setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id         : setting.id,
                        isArchived : true
                    });

                    const syncToRemoveInitChangesResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveInitChanges
                    });
                    const [ lastUpdateTimeSyncToRemoveInitChanges ] = syncToRemoveInitChangesResult.split('%');
                    const lastUpdateTimeToRemoveChangesForHiding = `${lastUpdateTimeSyncToRemoveInitChanges + 1}`;

                    // show hidden setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id         : setting.id,
                        isArchived : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveChangesForHiding
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');

                    expect(tokensToDeleteStr).toBe('');
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return rules to add for new added subject and tokens to delete ' +
                'for deleted subject for token reader from access setting when add new subject and ' +
                'delete old subject',
                factory.wrapInRollbackTransaction(async () => {
                    // create new subject
                    const { data: subjectToAdd } = await new AccessSubjectsCreate({ context: {} }).run({
                        name                  : accessSubjects[1].name,
                        position              : accessSubjects[1].position,
                        email                 : accessSubjects[1].email,
                        phone                 : accessSubjects[1].phone,
                        mobileEnabled         : accessSubjects[1].mobileEnabled,
                        accessSubjectTokenIds : [ token.id ]
                    });

                    const expectedSubjectToAddMobileToken = `sbj-${subjectToAdd.virtualCode}`;
                    const expectedTokensToDelete = [ subjectMobileToken, token.code, expectedSubjectToAddMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [
                        `${expectedSubjectToAddMobileToken}_/3_1_2_1111100`,
                        `${token.code}_/3_1_2_1111100`
                    ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;
                    const tokenReaderActiveAt = new Date();

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id               : setting.id,
                        accessSubjectIds : [ subjectToAdd.id ] // remove first subject and add second
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return rules to add for new added token reader and tokens to ' +
                'delete for deleted token reader for token reader from access setting when add new token reader ' +
                'and delete old token reader',
                factory.wrapInRollbackTransaction(async () => {
                    // create new token reader
                    const { data: readerToAdd } = await new AccessTokenReadersCreate({ context: {} }).run({
                        name : accessTokenReaders[1].name,
                        code : accessTokenReaders[1].code
                    });

                    const expectedTokensToDeleteForReaderToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteForReaderToDeleteLength =
                        expectedTokensToDeleteForReaderToDelete.length;

                    const expectedTokensToDeleteForReaderToAdd = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteForReaderToAddLength = expectedTokensToDeleteForReaderToAdd.length;
                    const expectedRulesToAddForReaderToAdd = [
                        `${subjectMobileToken}_/3_1_2_1111100`,
                        `${token.code}_/3_1_2_1111100`
                    ];
                    const expectedRulesToAddForReaderToAddLength = expectedRulesToAddForReaderToAdd.length;

                    const tokenReaderActiveAt = new Date();

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                   : setting.id,
                        accessTokenReaderIds : [ readerToAdd.id ] // remove first reader and add second
                    });

                    const resultReaderToDelete = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStrForReaderToDelete, tokensRulesStrForReaderToDelete ] =
                        resultReaderToDelete.split('%');
                    const tokensToDeleteForDeletedReader = tokensToDeleteStrForReaderToDelete.split(',');

                    const resultReaderToAdd = await new AccessTokensSync({
                        context : {
                            tokenReaderId : readerToAdd.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStrForReaderToAdd, tokensRulesStrForReaderToAdd ] =
                        resultReaderToAdd.split('%');
                    const tokensToDeleteForAddedReader = tokensToDeleteStrForReaderToAdd.split(',');
                    const tokensRulesToAddForAddedReader = tokensRulesStrForReaderToAdd.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDeleteForDeletedReader).toHaveLength(expectedTokensToDeleteForReaderToDeleteLength);
                    expect(tokensToDeleteForDeletedReader).toStrictEqual(
                        expect.arrayContaining(expectedTokensToDeleteForReaderToDelete)
                    );
                    expect(tokensRulesStrForReaderToDelete).toBe('\n');

                    expect(tokensToDeleteForAddedReader).toHaveLength(expectedTokensToDeleteForReaderToAddLength);
                    expect(tokensToDeleteForAddedReader).toStrictEqual(
                        expect.arrayContaining(expectedTokensToDeleteForReaderToAdd)
                    );
                    expect(tokensRulesToAddForAddedReader).toHaveLength(expectedRulesToAddForReaderToAddLength);
                    expect(tokensRulesToAddForAddedReader).toStrictEqual(
                        expect.arrayContaining(expectedRulesToAddForReaderToAdd)
                    );
                })
            );

            test(
                'POSITIVE: it should return all rules(both tokens to delete and rules to add) for token reader from ' +
                'access setting when add schedule',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111000`, `${token.code}_/3_1_2_1111000` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;
                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // create new schedule
                    const { data: scheduleToAdd } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    // clear rules that were created during setting creation
                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, scheduleToAdd.id ] // add new schedule
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return rules for all tokens to delete and rules to add ' +
                'only for remaining schedule when delete another schedule',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100`, `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;
                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // create new schedule
                    const { data: scheduleToAdd } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    // clear rules that were created during setting creation
                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, scheduleToAdd.id ] // add new schedule
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id ] // delete new schedule
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );
        });

        // Tests that are related to changing access token readers that causes changing of rules that
        // Sync service returns
        describe('Access token readers', () => {
            test(
                'POSITIVE: it should return all rules(both tokens to delete and rules to add) for token reader ' +
                'when create token reader with group that attached to existing setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100`, `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // create new readers group
                    const { data: group } = await new AccessReaderGroupsCreate({ context: {} }).run({
                        name : accessReadersGroups[0].name
                    });

                    // attach group to existing setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                    : [ setting.id ],
                        accessReadersGroupIds : [ group.id ]
                    });

                    // create new reader in group
                    await new AccessTokenReadersCreate({ context: {} }).run({
                        name                  : accessTokenReaders[1].name,
                        code                  : accessTokenReaders[1].code,
                        accessReadersGroupIds : [ group.id ]
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return all rules to delete for token reader from access setting ' +
                'when disable token reader',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const tokenReaderActiveAt = new Date();

                    // disable token reader
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id      : reader.id,
                        enabled : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all rules(both tokens to delete and rules to add) for token reader ' +
                'when enable it from disable state',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100`, `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;
                    const tokenReaderActiveAt = new Date();

                    // disable token reader
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id      : reader.id,
                        enabled : false
                    });
                    // enable after disabling
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id      : reader.id,
                        enabled : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                "POSITIVE: it should return all subjects' tokens to delete for token reader when hide it",
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const tokenReaderActiveAt = new Date();

                    // hide token reader
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id         : reader.id,
                        isArchived : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return response with no changes when show hidden token reader',
                factory.wrapInRollbackTransaction(async () => {
                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTimeInitSync ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemoveInitChanges = `${+lastUpdateTimeInitSync + 1}`;

                    // hide token reader
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id         : reader.id,
                        isArchived : true
                    });

                    const syncToRemoveInitChangesResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveInitChanges
                    });
                    const [ lastUpdateTimeSyncToRemoveInitChanges ] = syncToRemoveInitChangesResult.split('%');
                    const lastUpdateTimeToRemoveChangesForHiding = `${lastUpdateTimeSyncToRemoveInitChanges + 1}`;

                    // show token reader
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id         : reader.id,
                        isArchived : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveChangesForHiding
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');

                    expect(tokensToDeleteStr).toBe('');
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all rules(both tokens to delete and rules to add) from added group ' +
                'when add token reader to new group',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100`, `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // create new readers group
                    const { data: group } = await new AccessReaderGroupsCreate({ context: {} }).run({
                        name : accessReadersGroups[0].name
                    });

                    // attach group to existing setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                    : [ setting.id ],
                        accessReadersGroupIds : [ group.id ]
                    });

                    // create new reader
                    const { data: reader } = await new AccessTokenReadersCreate({ context: {} }).run({
                        name : accessTokenReaders[1].name,
                        code : accessTokenReaders[1].code
                    });

                    // add reader to new group
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id                    : reader.id,
                        accessReadersGroupIds : [ group.id ]
                    });
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return all tokens to delete from group when delete group from token reader',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    // create new readers group
                    const { data: group } = await new AccessReaderGroupsCreate({ context: {} }).run({
                        name : accessReadersGroups[0].name
                    });

                    // attach group to existing setting
                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                    : [ setting.id ],
                        accessReadersGroupIds : [ group.id ]
                    });

                    // create new reader
                    const { data: reader } = await new AccessTokenReadersCreate({ context: {} }).run({
                        name : accessTokenReaders[1].name,
                        code : accessTokenReaders[1].code
                    });

                    // add reader to new group
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id                    : reader.id,
                        accessReadersGroupIds : [ group.id ]
                    });
                    // delete group from token reader
                    await new AccessTokenReadersUpdate({ context: {} }).run({
                        id                    : reader.id,
                        accessReadersGroupIds : []
                    });
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );
        });

        // Tests that are related to changing access subjects that causes changing of rules that
        // Sync service returns
        describe('Access subjects', () => {
            test(
                'POSITIVE: it should return all tokens(that are related to subject) to delete to token reader  ' +
                'when delete subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    await new AccessSubjectsDelete({ context: {} }).run({
                        id : subject.id
                    });

                    const tokenReaderActiveAt = new Date();
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all tokens(that are related to subject) to delete to token reader  ' +
                'when disable subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id      : subject.id,
                        enabled : false
                    });

                    const tokenReaderActiveAt = new Date();
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all rules(that are related to subject) to token reader ' +
                'when enable disabled subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100`, `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id      : subject.id,
                        enabled : false
                    });
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id      : subject.id,
                        enabled : true
                    });

                    const tokenReaderActiveAt = new Date();
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return all tokens(that are related to subject) to delete to token reader ' +
                'when hide subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken, token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id         : subject.id,
                        isArchived : true
                    });

                    const tokenReaderActiveAt = new Date();
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : '0'
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return response with no chages to token reader ' +
                'when show hidden subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTimeInitSync ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemoveInitChanges = `${+lastUpdateTimeInitSync + 1}`;

                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id         : subject.id,
                        isArchived : true
                    });

                    const syncToRemoveInitChangesResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveInitChanges
                    });
                    const [ lastUpdateTimeSyncToRemoveInitChanges ] = syncToRemoveInitChangesResult.split('%');
                    const lastUpdateTimeToRemoveChangesForHiding = `${lastUpdateTimeSyncToRemoveInitChanges + 1}`;

                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id         : subject.id,
                        isArchived : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveChangesForHiding
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');

                    expect(tokensToDeleteStr).toBe('');
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all rules(both tokens to delete and rules to add) for added subject token ' +
                'to token reader when add token to subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // create new subject token
                    const { data: addedToken } = await new AccessSubjectTokensCreate({ context: {} }).run({
                        name : accessSubjectTokens[1].name,
                        code : accessSubjectTokens[1].code
                    });

                    // add new token
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id                    : subject.id,
                        accessSubjectTokenIds : [ token.id, addedToken.id ]
                    });

                    const expectedTokensToDelete = [ addedToken.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${addedToken.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return token(that are related to subject) for deleting to token reader ' +
                'when delete token from subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // remove token
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id                    : subject.id,
                        accessSubjectTokenIds : []
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return mobile access token(that are related to subject) to delete to token ' +
                'reader when disable mobile access for subject and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // disable mobile access
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id            : subject.id,
                        mobileEnabled : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return mobile access token rule(that are related to subject) for adding to ' +
                'token reader when enable mobile access for subject and token reader and subject exist in the same ' +
                'setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectMobileToken}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // disable mobile access
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id            : subject.id,
                        mobileEnabled : false
                    });
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id            : subject.id,
                        mobileEnabled : true,
                        email         : subject.email
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return phone call access token rule(that are related to subject) to add to ' +
                'token reader when enable phone call access for subject and token reader and subject exist in the ' +
                'same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectPhoneToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${subjectPhoneToken}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // enable phone call access
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id           : subject.id,
                        phoneEnabled : true,
                        phone        : subject.phone
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return phone call access token(that are related to subject) to delete to token ' +
                'reader when disable phone call access for subject and token reader and subject exist in the ' +
                'same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ subjectPhoneToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // enable phone call access
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id           : subject.id,
                        phoneEnabled : true,
                        phone        : subject.phone
                    });

                    // disable phone call access
                    await new AccessSubjectsUpdate({ context: {} }).run({
                        id           : subject.id,
                        phoneEnabled : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );
        });

        // Tests that are related to changing access subjects tokens that causes changing of rules that
        // Sync service returns
        describe('Access subjects tokens', () => {
            test(
                'POSITIVE: it should return token(that are related to subject) to delete to token reader ' +
                'when delete token and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    await new AccessSubjectTokensDelete({ context: {} }).run({
                        id : token.id
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return token(that are related to subject) to delete to token reader ' +
                'when disable token and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // disable token
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id      : token.id,
                        enabled : false
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return all rules(that are related to subject) to token reader ' +
                'when enable token and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${token.code}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // disable token
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id      : token.id,
                        enabled : false
                    });
                    // enable token
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id      : token.id,
                        enabled : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return token(that are related to subject) to delete to token reader ' +
                'when hide token and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // hide token
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id         : token.id,
                        isArchived : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return response with no changes to token reader ' +
                'when show hidden token and token reader and subject exist in the same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTimeInitSync ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemoveInitChanges = `${+lastUpdateTimeInitSync + 1}`;

                    const syncToRemoveInitChangesResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveInitChanges
                    });
                    const [ lastUpdateTimeSyncToRemoveInitChanges ] = syncToRemoveInitChangesResult.split('%');
                    const lastUpdateTimeToRemoveChangesForHiding = `${lastUpdateTimeSyncToRemoveInitChanges + 1}`;

                    // hide token
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id         : token.id,
                        isArchived : true
                    });

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveChangesForHiding
                    });

                    // show token
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id         : token.id,
                        isArchived : false
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');

                    expect(tokensToDeleteStr).toBe('');
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                'POSITIVE: it should return old token code(that are related to subject) to delete to token reader ' +
                'and rules for new token code when change token code and token reader and subject exist in the ' +
                'same setting',
                factory.wrapInRollbackTransaction(async () => {
                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;
                    const newCode = accessSubjectTokens[1].code;

                    const expectedTokensToDelete = [ token.code, newCode ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${newCode}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // change code
                    await new AccessSubjectTokensUpdate({ context: {} }).run({
                        id   : token.id,
                        code : accessSubjectTokens[1].code
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );
        });

        // Tests that are related to changing access schedules tokens that causes changing of rules that
        // Sync service returns
        describe('Access schedules', () => {
            test(
                "POSITIVE: it should return all access setting subjects' tokens to delete and rules to add " +
                'for remaining schedules when delete schedule and it is attached to existing access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code, subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${token.code}_/3_1_2_1111100`, `${subjectMobileToken}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // create new schedule
                    const { data: newSchedule } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, newSchedule.id ] // add new schedule
                    });

                    await new AccessSchedulesDelete({ context: {} }).run({
                        id : newSchedule.id
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });

                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                "POSITIVE: it should return all access setting subjects' tokens to delete and rules to add " +
                'for remaining schedules when disable schedule and it is attached to existing access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code, subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${token.code}_/3_1_2_1111100`, `${subjectMobileToken}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // create new schedule
                    const { data: newSchedule } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, newSchedule.id ] // add new schedule
                    });

                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id      : newSchedule.id,
                        enabled : false
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });

                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                "POSITIVE: it should return all access setting subjects' tokens to delete and rules to add " +
                'for remaining schedules when enable schedule and it is attached to existing access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code, subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${token.code}_/3_1_2_1111100`, `${subjectMobileToken}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTime ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemovePrevChanges = `${+lastUpdateTime + 1}`;

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemovePrevChanges
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    // disable schedule
                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id      : schedule.id,
                        enabled : false
                    });
                    // enable schedule
                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id      : schedule.id,
                        enabled : true
                    });

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                "POSITIVE: it should return all access setting subjects' tokens to delete and rules to add " +
                'for remaining schedules when hide schedule and it is attached to existing access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code, subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [ `${token.code}_/3_1_2_1111100`, `${subjectMobileToken}_/3_1_2_1111100` ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // create new schedule
                    const { data: newSchedule } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, newSchedule.id ] // add new schedule
                    });

                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id         : newSchedule.id,
                        isArchived : true
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });

                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );

            test(
                'POSITIVE: it should return response with no changes to token readers ' +
                'when show hidden schedule and it is attached to existing access setting',
                factory.wrapInRollbackTransaction(async () => {
                    // create new schedule
                    const { data: newSchedule } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, newSchedule.id ] // add new schedule
                    });

                    const initialSyncResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : '0'
                    });
                    const [ lastUpdateTimeInitSync ] = initialSyncResult.split('%');
                    const lastUpdateTimeToRemoveInitChanges = `${+lastUpdateTimeInitSync + 1}`;

                    const syncToRemoveInitChangesResult = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveInitChanges
                    });
                    const [ lastUpdateTimeSyncToRemoveInitChanges ] = syncToRemoveInitChangesResult.split('%');
                    const lastUpdateTimeToRemoveChangesForHidingToken = `${lastUpdateTimeSyncToRemoveInitChanges + 1}`;

                    // hide schedule
                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id         : newSchedule.id,
                        isArchived : true
                    });

                    await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id
                        }
                    }).run({
                        body : lastUpdateTimeToRemoveChangesForHidingToken
                    });

                    // show schedule
                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id         : newSchedule.id,
                        isArchived : false
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;

                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });
                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');

                    expect(tokensToDeleteStr).toBe('');
                    expect(tokensRulesStr).toBe('\n');
                })
            );

            test(
                "POSITIVE: it should return all access setting subjects' tokens to delete and rules to add " +
                'for remaining schedules and for changed current schedule when change schedule dates and it is ' +
                'attached to existing access setting',
                factory.wrapInRollbackTransaction(async () => {
                    const expectedTokensToDelete = [ token.code, subjectMobileToken ];
                    const expectedTokensToDeleteLength = expectedTokensToDelete.length;
                    const expectedRulesToAdd = [
                        `${token.code}_/3_1_2_1111100`,
                        `${subjectMobileToken}_/3_1_2_1111100`,
                        `${token.code}_/3_1_2_1110000`,
                        `${subjectMobileToken}_/3_1_2_1110000`
                    ];
                    const expectedRulesToAddLength = expectedRulesToAdd.length;

                    // create new schedule
                    const { data: newSchedule } = await new AccessSchedulesCreate({ context: {} }).run({
                        name  : accessSchedules[1].name,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[1].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[1].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[1].dailyIntervalEnd
                            }
                        ]
                    });

                    await new AccessSettingsUpdate({ context: {} }).run({
                        id                : setting.id,
                        accessScheduleIds : [ schedule.id, newSchedule.id ] // add new schedule
                    });

                    // change schedule dates
                    await new AccessSchedulesUpdate({ context: {} }).run({
                        id    : newSchedule.id,
                        dates : [
                            {
                                weekBitMask        : accessSchedulesDates[2].weekBitMask,
                                dailyIntervalStart : accessSchedulesDates[2].dailyIntervalStart,
                                dailyIntervalEnd   : accessSchedulesDates[2].dailyIntervalEnd
                            }
                        ]
                    });

                    const tokenReaderActiveAt = new Date();
                    // convert milliseconds to minutes
                    const expectedLastUpdateTime = `${Math.floor(tokenReaderActiveAt / 60000)}`;
                    const result = await new AccessTokensSync({
                        context : {
                            tokenReaderId : reader.id,
                            tokenReaderActiveAt
                        }
                    }).run({
                        body : expectedLastUpdateTime
                    });

                    const [ , tokensToDeleteStr, tokensRulesStr ] = result.split('%');
                    const tokensToDelete = tokensToDeleteStr.split(',');
                    const tokensRulesToAdd = tokensRulesStr.split(/\r?\n/).filter((x) => x);

                    expect(tokensToDelete).toHaveLength(expectedTokensToDeleteLength);
                    expect(tokensToDelete).toStrictEqual(expect.arrayContaining(expectedTokensToDelete));
                    expect(tokensRulesToAdd).toHaveLength(expectedRulesToAddLength);
                    expect(tokensRulesToAdd).toStrictEqual(expect.arrayContaining(expectedRulesToAdd));
                })
            );
        });
    });
});
