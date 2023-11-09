const { getFormattedCurrentTimezoneOffset } = require('../../../../lib/utils/common');

describe('Common utils', () => {
    describe('getFormattedCurrentTimezoneOffset', () => {
        describe('POSITIVE', () => {
            it.each`
                timeZone                 | offset  | expected
                ${'Pacific/Apia'}        | ${+13}  | ${'+13:00'}
                ${'Asia/Magadan'}        | ${+12}  | ${'+12:00'}
                ${'Asia/Vladivostok'}    | ${+11}  | ${'+11:00'}
                ${'Australia/Currie'}    | ${+10}  | ${'+10:00'}
                ${'Asia/Yakutsk'}        | ${+9}   | ${'+09:00'}
                ${'Asia/Irkutsk'}        | ${+8}   | ${'+08:00'}
                ${'Asia/Novosibirsk'}    | ${+7}   | ${'+07:00'}
                ${'Asia/Dhaka'}          | ${+6}   | ${'+06:00'}
                ${'Asia/Karachi'}        | ${+5}   | ${'+05:00'}
                ${'Asia/Tehran'}         | ${+4.5} | ${'+04:30'}
                ${'Asia/Yerevan'}        | ${+4}   | ${'+04:00'}
                ${'Europe/Kiev'}         | ${+3}   | ${'+03:00'}
                ${'Africa/Tripoli'}      | ${+2}   | ${'+02:00'}
                ${'Africa/Windhoek'}     | ${+1}   | ${'+01:00'}
                ${'Africa/Dakar'}        | ${0}    | ${'+00:00'}
                ${'Atlantic/Cape_Verde'} | ${-1}   | ${'-01:00'}
                ${'America/Noronha'}     | ${-2}   | ${'-02:00'}
                ${'America/Bahia'}       | ${-3}   | ${'-03:00'}
                ${'America/New_York'}    | ${-4}   | ${'-04:00'}
                ${'America/Caracas'}     | ${-4.5} | ${'-04:30'}
                ${'America/Chicago'}     | ${-5}   | ${'-05:00'}
                ${'America/Belize'}      | ${-6}   | ${'-06:00'}
                ${'America/Creston'}     | ${-7}   | ${'-07:00'}
                ${'America/Los_Angeles'} | ${-8}   | ${'-08:00'}
                ${'Pacific/Honolulu'}    | ${-10}  | ${'-10:00'}
                ${'Pacific/Midway'}      | ${-11}  | ${'-11:00'}
            `(
                'returns "$expected" when time zone is $timeZone which has $offset hours offset',
                ({ offset, expected }) => {
                    const utcAndCurrentTimezoneDifferenceInMinutes = -(offset * 60);

                    Date.prototype.getTimezoneOffset = jest
                        .fn()
                        .mockReturnValue(utcAndCurrentTimezoneDifferenceInMinutes);

                    const result = getFormattedCurrentTimezoneOffset();

                    expect(result).toBe(expected);
                }
            );
        });
    });
});
