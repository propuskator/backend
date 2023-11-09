const { default: AccessLogsSave } = require('../../../../../../../lib/services/tokenReader/v1/accessLogs/Save');

describe('Access logs save', () => {
    describe('isSpecialCode', () => {
        describe('POSITIVE', () => {
            it.each`
                code           | expected
                ${'btn-exit'}  | ${true}
                ${'alarm'}     | ${true}
                ${'fake-code'} | ${false}
            `('returns "$expected" when code is "$code"', ({ code, expected }) => {
                const result = AccessLogsSave.isSpecialCode(code);

                expect(result).toBe(expected);
            });
        });
    });
});
