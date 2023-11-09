const fs = require('fs');

const csvToJSON = require('../../../../lib/services/admin/utilsServices/CsvToJson');
const json = require('./etc/test.json');
const csvBuffer = fs.readFileSync(__dirname + '/etc/test.csv');

jest.setTimeout(3000);

describe('test utils services', () => {
    test('POSITIVE: csv to json', (async () => {
        const { data } = await (new csvToJSON({ context: {} }).run({ file: { buffer: csvBuffer }}));

        expect(data).toMatchObject(json);
    }))
});