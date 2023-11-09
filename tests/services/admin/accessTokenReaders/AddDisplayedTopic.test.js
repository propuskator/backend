const TestFactory                  = require('../../../utils');
const AdminUsersRegister           = require('../../../../lib/services/admin/adminUsers/Register');
const AdminUser                    = require('../../../../lib/models/AdminUser');
const Workspace                    = require('../../../../lib/models/Workspace');
const AccessTokenReader            = require('../../../../lib/models/AccessTokenReader');
const AccessTokenReadersList       = require('../../../../lib/services/admin/accessTokenReaders/List');
const AddDisplayedTopic            = require('../../../../lib/services/admin/accessTokenReaders/AddDisplayedTopic');
const { NotFoundError }            = require('../../../../lib/services/utils/SX');
const [ , adminUserFixture ]       = require('../../../fixtures/adminUsers');
const [ , workspaceFixture ]       = require('../../../fixtures/workspaces');
const [ accessTokenReaderFixture ] = require('../../../fixtures/accessTokenReaders');

const factory = new TestFactory();

describe('admin: accessTokenReaders/AddDisplayedTopic', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: should successfully add topic for displaying for the reader', factory.wrapInRollbackTransaction(async () => {
        const workspaceId = factory.cls.get('workspaceId');
        const reader = await AccessTokenReader.create({
            ...accessTokenReaderFixture,
            workspaceId
        });
        const addDisplayedTopicService = new AddDisplayedTopic({ context: {} });
        const listAccessTokenReadersService = new AccessTokenReadersList({ context: {} });
        const topicToAdd = 'test/topic';

        const result = await addDisplayedTopicService.run({
            accessTokenReaderId : reader.id,
            topic               : 'test/topic'
        });
        const readersList = await listAccessTokenReadersService.run({});

        expect(result).toMatchObject({
            data : {
                displayedTopics : [ topicToAdd ]
            }
        });
        expect(readersList).toMatchObject({
            data : [
                {
                    displayedTopics : [ topicToAdd ]
                }
            ]
        });
    }));

    test(
        'NEGATIVE: should throw not found error when reader doesn\'t exists',
        factory.wrapInRollbackTransaction(async () => {
            const addDisplayedTopicService = new AddDisplayedTopic({ context: {} });

            await expect(addDisplayedTopicService.run({
                accessTokenReaderId : accessTokenReaderFixture.id,
                topic               : 'test/topic'
            }))
            .rejects
            .toThrowError(NotFoundError);
        })
    )
});
