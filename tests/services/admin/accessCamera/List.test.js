const AccessCamera                      = require('../../../../lib/models/AccessCamera');
const AccessCameraList                  = require('../../../../lib/services/admin/accessCameras/List');
const TestFactory                       = require('../../../utils');
const accessCamerasListFixturesInput    = require('../../../fixtures/services/admin/accessCameras/list/input.json');
const accessCamerasListFixturesExpected = require('../../../fixtures/services/admin/accessCameras/list/expected.json');

const factory = new TestFactory();

describe('admin: accessCameras/List service', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test(
        'POSITIVE: should successfully return cameras list with pagination',
        factory.wrapInRollbackTransaction(async () => {
            const workspaceId = factory.cls.get('workspaceId');
            const accessCamerasFixturesWithCurrentWorkspaceId = accessCamerasListFixturesInput.map(camera => ({
                ...camera,
                workspaceId
            }));

            await AccessCamera.bulkCreate(accessCamerasFixturesWithCurrentWorkspaceId);

            const limit = 10;
            const firstPageExpectedResult = accessCamerasListFixturesExpected.slice(0, limit);
            const secondPageExpectedResult = accessCamerasListFixturesExpected.slice(limit, limit * 2);

            const firstPageResult = await new AccessCameraList({ context: {} }).run({
                isArchived : false,
                limit,
                offset     : 0,
                order      : 'ASC',
                sortedBy   : 'createdAt'
            });
            const secondPageResult = await new AccessCameraList({ context: {} }).run({
                isArchived : false,
                limit,
                offset     : 10,
                order      : 'ASC',
                sortedBy   : 'createdAt'
            });

            expect(firstPageResult).toMatchObject({
                data : firstPageExpectedResult,
                meta : {
                    filteredCount : 20,
                    total         : 20
                }
            });
            expect(secondPageResult).toMatchObject({
                data : secondPageExpectedResult,
                meta : {
                    filteredCount : 20,
                    total         : 20
                }
            });
        })
    );
});