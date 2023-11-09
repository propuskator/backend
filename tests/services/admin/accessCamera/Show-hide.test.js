const CreateService = require('../../../../lib/services/admin/accessCameras/Create');
const UpdateService = require('../../../../lib/services/admin/accessCameras/Update');
const TestFactory = require('../../../utils');

jest.setTimeout(30000);
const factory = new TestFactory();

describe('Admin AccessCameras show and hide', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });
    afterAll(async () => {
        await factory.end();
    });
    test('POSITIVE: hide camera', factory.wrapInRollbackTransaction(async () => {
        const { data : { id: cameraId } } = await(new CreateService({ context: {} })).run({
            name: 'cameraname',
            rtspUrl: 'rtsp://some.url.com'
        });
        const { data: resData } = await (new UpdateService({ context: {} })).run({
            id: cameraId,
            isArchived: true
        });

        expect(resData).toMatchObject({
            isArchived: true,
            enabled: false
        });
    }));

    test('POSITIVE: show camera', factory.wrapInRollbackTransaction(async () => {
        const { data : {
                id: cameraId,
                name,
                wssStreamUrl,
                createdAt,
                lastSuccessStreamAt,
                lastAttemptAt,
                accessTokenReaders,
                poster,
                status
            } 
        } = await (new CreateService({ context: {} })).run({
            name: 'cameraname',
            rtspUrl: 'rtsp://some.url.com'
        });
        const { data: resData } = await (new UpdateService({ context: {} })).run({
            id: cameraId,
            isArchived: false
        });

        expect(resData).toMatchObject({
            isArchived: false,
            name,
            wssStreamUrl,
            createdAt,
            lastSuccessStreamAt,
            lastAttemptAt,
            accessTokenReaders,
            poster,
            status,
            enabled: true
        });
    }));
});
