const CreateReader = require('../../../../../lib/services/admin/accessTokenReaders/Create');
const CreateToken = require('../../../../../lib/services/admin/accessSubjectTokens/Create');
const CreateGroup = require('../../../../../lib/services/admin/accessReaderGroups/Create');
const CreateSettings = require('../../../../../lib/services/admin/accessSettings/Create');
const CreateSchedule = require('../../../../../lib/services/admin/accessSchedules/Create');

const UpdateSubject = require('../../../../../lib/services/admin/accessSubjects/Update');
const ShowSubject = require('../../../../../lib/services/admin/accessSubjects/Show')

const ReaderSync = require('../../../../../lib/services/tokenReader/v1/accessTokens/Sync');

const { registerUser } = require('../../../mobile/user/utils');
const TestFactory = require('../../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('TokenReader sync', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: receive rule for week bit-mask schedule', factory.wrapInRollbackTransaction(async () => {
        const weekBitMask = [0,0,0,1,1,1,1];
        const scheduleDates = [{
            weekBitMask,
            dailyIntervalStart: 60000,
            dailyIntervalEnd: 120000
        }];
        const { reader, token, subject } = await _createSettings({ scheduleDates });
        const body = `${_getTimeInMinutest(new Date()) - 5}`// 5 minutes before
        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body:  body
        });
        /* example of response
            0%CODE,sbj-ERMRRJ89K4ER% 
            sbj-ERMRRJ89K4ER_/3_1_2_0001111
            CODE_/3_1_2_0001111
        */
        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');
        const tokensDeleteList = tokensDeleteStr.split(',');
        const tokenRulesList = tokensRulesStr.split(/\r?\n/);

        expect(+lastUpdateTime).toEqual(0);
        expect(tokensDeleteList.includes(token.code)).toEqual(true);
        expect(tokensDeleteList.includes(`sbj-${subject.virtualCode}`)).toEqual(true);
        expect(tokensDeleteList.includes(`phn-${subject.virtualCode}`)).toEqual(true);

        expect(tokenRulesList.includes(`sbj-${subject.virtualCode}_/3_1_2_${weekBitMask.join(',')}`));
        expect(tokenRulesList.includes(`phn-${subject.virtualCode}_/3_1_2_${weekBitMask.join(',')}`));
        expect(tokenRulesList.includes(`${token.code}_/3_1_2_${weekBitMask.join(',')}`));
    }));

    test('POSITIVE: receive rule for timestamps interval schedule', factory.wrapInRollbackTransaction(async () => {
        const from = _getTimeInMinutest(new Date());
        const to = _getTimeInMinutest(new Date()) + 1000;
        const scheduleDates = [{
            from,
            to
        }];
        const { reader, token, subject } = await _createSettings({ scheduleDates });

        const body = `${_getTimeInMinutest(new Date()) - 5}` // 5 minutes before
        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body:  body
        });
        /* example of response
           0%CODE,sbj-T0REKTD7PEDJ%
           sbj-T0REKTD7PEDJ_/1_450_450
           CODE_/1_450_450
        */
        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');
        const tokensDeleteList = tokensDeleteStr.split(',');
        const tokenRulesList = tokensRulesStr.split(/\r?\n/);

        expect(+lastUpdateTime).toEqual(0);
        expect(tokensDeleteList.includes(token.code)).toEqual(true);
        expect(tokensDeleteList.includes(`sbj-${subject.virtualCode}`)).toEqual(true);
        expect(tokensDeleteList.includes(`phn-${subject.virtualCode}`)).toEqual(true);

        expect(tokenRulesList.includes(`sbj-${subject.virtualCode}_/1_${from}_${to}`));
        expect(tokenRulesList.includes(`phn-${subject.virtualCode}_/1_${from}_${to}`));
        expect(tokenRulesList.includes(`${token.code}_/1_${from}_${to}`));
    }));

    test('POSITIVE: receive rule for week bit-mask with `from-to` interval schedule', factory.wrapInRollbackTransaction(async () => {
        const from = _getTimeInMinutest(new Date());
        const to = _getTimeInMinutest(new Date()) + 1000;
        const weekBitMask = [0,0,0,1,1,1,1];
        const scheduleDates = [{
            weekBitMask,
            from,
            to,
            dailyIntervalStart: 60000,
            dailyIntervalEnd: 120000
        }];
        const { reader, token, subject } = await _createSettings({ scheduleDates });

        const body = `${_getTimeInMinutest(new Date()) - 5}`// 5 minutes before
        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body:  body
        });
        /* example of response
            0%CODE,sbj-RYF68Q6ZN3NR%
            sbj-RYF68Q6ZN3NR_/7_1_2_0001111_450_4502723
            CODE_/7_1_2_0001111_450_4502723
        */
        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');
        const tokensDeleteList = tokensDeleteStr.split(',');
        const tokenRulesList = tokensRulesStr.split(/\r?\n/);

        expect(+lastUpdateTime).toEqual(0);
        expect(tokensDeleteList.includes(token.code)).toEqual(true);
        expect(tokensDeleteList.includes(`sbj-${subject.virtualCode}`)).toEqual(true);
        expect(tokensDeleteList.includes(`phn-${subject.virtualCode}`)).toEqual(true);

        expect(tokenRulesList.includes(`sbj-${subject.virtualCode}_/7_1_2_${weekBitMask}_${from}_${to}`));
        expect(tokenRulesList.includes(`phn-${subject.virtualCode}_/7_1_2_${weekBitMask}_${from}_${to}`));
        expect(tokenRulesList.includes(`${token.code}_/3_1_2_${weekBitMask}_${from}_${to}`));
    }));

    test('Positive: should return blank rule on second sync rule', factory.wrapInRollbackTransaction(async () => {
        const { reader } = await _createSettings({ 
            scheduleDates: [{
                weekBitMask: [0,0,0,1,1,1,1],
                dailyIntervalStart: 60000,
                dailyIntervalEnd: 120000
            }]
        });
        // first sync call
        await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body: _getTimeInMinutest(new Date()) - 5 // 5 minutes before
        });
        // second sync call
        const body = _getTimeInMinutest(new Date()) + 5; // 5 minute after now
        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body
        });
        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');

        expect(lastUpdateTime).toEqual(body);
        expect(tokensDeleteStr).toEqual("");
        expect(tokensRulesStr).toEqual("\n");
    }));

    test('Positive: should return rules for full access', factory.wrapInRollbackTransaction(async () => {
        const { reader, subject, token } = await _createSettings({ 
            scheduleDates: [{
                weekBitMask: [1,1,1,1,1,1,1],
                dailyIntervalStart: 0,
                dailyIntervalEnd: 86340000,
                from: null,
                end: null
            }]
        });

        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body: `${_getTimeInMinutest(new Date()) - 5}`// 5 minutes before
        });
        /* example of response
            0%CODE,sbj-RYF68Q6ZN3NR%
            sbj-RYF68Q6ZN3NR_/7_1_2_0001111_450_4502723
            CODE_/7_1_2_0001111_450_4502723
        */
        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');
        const tokensDeleteList = tokensDeleteStr.split(',');
        const tokenRulesList = tokensRulesStr.split(/\r?\n/);

        expect(+lastUpdateTime).toEqual(0);
        expect(tokensDeleteList.includes(token.code)).toEqual(true);
        expect(tokensDeleteList.includes(`sbj-${subject.virtualCode}`)).toEqual(true);
        expect(tokensDeleteList.includes(`phn-${subject.virtualCode}`)).toEqual(true);

        expect(tokenRulesList.includes(`sbj-${subject.virtualCode}_/9_1`));
        expect(tokenRulesList.includes(`phn-${subject.virtualCode}_/9_1`));
        expect(tokenRulesList.includes(`${token.code}_/9_1`));
    }));

    test('Positive: should not return rule for mobile virtual code of subject with mobileEnabled=false', factory.wrapInRollbackTransaction(async () => {
        const { reader, subject } = await _createSettings({ 
            scheduleDates: [{
                weekBitMask: [0,0,0,1,1,1,1],
                dailyIntervalStart: 60000,
                dailyIntervalEnd: 120000
            }]
        });

        await _disableMobileAccess(subject);
        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body: _getTimeInMinutest(new Date()) - 5 // 5 minutes before
        });

        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');
        const tokensDeleteList = tokensDeleteStr.split(',');
        const tokenRulesList = tokensRulesStr.split(/\r?\n/);

        expect(+lastUpdateTime).toEqual(0);
        expect(tokensDeleteList.includes(`sbj-${subject.virtualCode}`)).toEqual(true);
        expect(tokenRulesList.includes(`sbj-${subject.virtualCode}_/3_1_2_0001111`)).toEqual(false);
    }));

    test('Positive: should not return rule for phone virtual code for subject with phoneEnabled=false', factory.wrapInRollbackTransaction(async () => {
        const { reader, subject } = await _createSettings({
            scheduleDates: [{
                weekBitMask: [0,0,0,1,1,1,1],
                dailyIntervalStart: 60000,
                dailyIntervalEnd: 120000
            }]
        });

        await _disablePhoneAccess(subject);
        const response = await (new ReaderSync({
            context: {
                tokenReaderId: reader.id,
                tokenReaderActiveAt: reader.activeAt 
            }
        })).run({
            body: _getTimeInMinutest(new Date()) - 5 // 5 minutes before
        });

        console.log(response);

        const [ lastUpdateTime, tokensDeleteStr, tokensRulesStr ] = response.split('%');
        const tokensDeleteList = tokensDeleteStr.split(',');
        const tokenRulesList = tokensRulesStr.split(/\r?\n/);

        expect(+lastUpdateTime).toEqual(0);
        expect(tokensDeleteList.includes(`phn-${subject.virtualCode}`)).toEqual(true);
        expect(tokenRulesList.includes(`phn-${subject.virtualCode}_/3_1_2_0001111`)).toEqual(false);
    }));
});

async function _createSettings({ scheduleDates }) {
    const { subject: { id: subjectId } } = await registerUser({
        email: 'test1234@gmail.com',
        workspace: 'workspace',
        password: 'Test1234'
    });
    const { data: subject } = await (new ShowSubject({ context: {} })).run({ id: subjectId });
    const { data: token } = await (new CreateToken({ context: {} })).run({
        name: 'tokenName',
        code: 'CODE',
        accessSubjectId: subject.id
    });
    const { data: reader } = await (new CreateReader({ context: {} }).run({
        name: 'readerName',
        code: 'readerCode'
    }));
    const { data: group } = await (new CreateGroup({ context: {} })).run({
        name: 'testGroup',
        accessTokenReaderIds: [reader.id]
    });
    const { data: schedule } = await (new CreateSchedule({ context: {} })).run({
        name: 'testSchedule',
        dates: scheduleDates
    });
    const { data: settings } = await (new CreateSettings({ context: {} })).run({
        accessReadersGroupIds: [group.id],
        accessTokenReaderIds: [reader.id],
        accessScheduleIds: [schedule.id],
        accessSubjectIds: [subject.id]
    });

    return { reader, settings, subject, token };
}

function _getTimeInMinutest(date) {
    return parseInt(date.getTime() / 1000 / 60).toFixed(0)
}

async function _disableMobileAccess(subject) {
    await (new UpdateSubject({ context: {} })).run({
        id: subject.id,
        mobileEnabled: false
    })
}

async function _disablePhoneAccess(subject) {
    await (new UpdateSubject({ context: {} })).run({
        id: subject.id,
        phoneEnabled: false
    })
}