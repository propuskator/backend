const UpdateService    = require('../../../../lib/services/admin/accessCameras/Update.js');
const AccessCamera     = require('../../../../lib/models/AccessCamera.js');
const TestFactory      = require('../../../utils');
const [ accessCamera ] = require('../../../fixtures/accessCameras.js');

const factory = new TestFactory();

describe('admin: accessCameras/Update service', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test(
        'POSITIVE: should not update rtspUrl attribute when it passed as empty string',
        factory.wrapInRollbackTransaction(async () => {
            await AccessCamera.create(accessCamera);

            await new UpdateService({ context: {} })
                .run({
                    ...accessCamera,
                    rtspUrl : ''
                });
            
            const updatedAccessCamera = await AccessCamera.findOne({ where: { id: accessCamera.id } });

            expect(updatedAccessCamera.rtspUrl).toEqual(accessCamera.rtspUrl);
        })
    );

    test('NEGATIVE: should throw an error on updating wrong RTSP URL', factory.wrapInRollbackTransaction(async () => {
        await AccessCamera.create(accessCamera);

        const wrongRtspUrl = 'rtsp://local;rm -rf /;echo'; // command injection example

        try {
            await new UpdateService({ context: {} })
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
