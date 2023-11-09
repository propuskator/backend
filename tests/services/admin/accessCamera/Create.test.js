const CreateService    = require('../../../../lib/services/admin/accessCameras/Create.js');
const TestFactory      = require('../../../utils');
const [ accessCamera ] = require('../../../fixtures/accessCameras.js');

const factory = new TestFactory();

describe('admin: accessCameras/Create service', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test('NEGATIVE: should throw an error on wrong RTSP URL', factory.wrapInRollbackTransaction(async () => {
        try {
            const wrongRtspUrl = 'rtsp://local;rm -rf /;echo'; // command injection example

            await new CreateService({ context: {} })
                .run({
                    ...accessCamera,
                    rtspUrl : wrongRtspUrl
                });
        } catch (err) {
            expect(err).toMatchObject({
                code   : 'FORMAT_ERROR',
                fields : {
                    rtspUrl : 'WRONG_RTSP_URL'
                }
            });
        }
    }));
});
