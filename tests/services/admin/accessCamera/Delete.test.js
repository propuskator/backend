const CreateService = require('../../../../lib/services/admin/accessCameras/Create');
const DeleteService = require('../../../../lib/services/admin/accessCameras/Delete');
const ReadersCreateService = require('../../../../lib/services/admin/accessTokenReaders/Create');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Admin AccessCameras delete', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: delete camera', factory.wrapInRollbackTransaction(async () => {
        const { data : { id: cameraId } } = await(new CreateService({ context: {} })).run({
            name: 'cameraname',
            rtspUrl: 'rtsp://some.url.com'
        });
        const res = await (new DeleteService({ context: {} })).run({
            id: cameraId
        });

        expect(res).toEqual({
            id: cameraId
        });
    }));

    test('POSITIVE: delete and create camera with linked readers', factory.wrapInRollbackTransaction(async () => {
        const { data: { id: readerId } } = await (new ReadersCreateService({ context: {} })).run({
            name: "readername",
            code: 'readercode' 
        });

        const { data : { id: cameraId } } = await (new CreateService({ context: {} })).run({
            name: 'cameraname',
            rtspUrl: 'rtsp://some.url.com',
            accessTokenReaderIds: [readerId]
        });
        await (new DeleteService({ context: {} })).run({
            id: cameraId
        });

        // pass readerId to another camera ( fails if reader have not been unlinked )
        await(new CreateService({ context: {} })).run({
            name: 'cameraname',
            rtspUrl: 'rtsp://some.url.com',
            accessTokenReaderIds: [readerId]
        });
    }));
});
