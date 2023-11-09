const TestFactory                  = require('../../../utils');
const ReaderDisplayedTopic         = require('../../../../lib/models/ReaderDisplayedTopic');
const AccessTokenReader            = require('../../../../lib/models/AccessTokenReader');
const AccessTokenReadersList       = require('../../../../lib/services/admin/accessTokenReaders/List');
const RemoveDisplayedTopic         = require('../../../../lib/services/admin/accessTokenReaders/RemoveDisplayedTopic');
const { NotFoundError }            = require('../../../../lib/services/utils/SX');
const [ accessTokenReaderFixture ] = require('../../../fixtures/accessTokenReaders');
const [ readerDisplayedTopic ]     = require('../../../fixtures/readersDisplayedTopics');

const factory = new TestFactory();

describe('admin: accessTokenReaders/RemoveDisplayedTopic', () => {
    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: should successfully remove added displayed topic', factory.wrapInRollbackTransaction(async () => {
        const workspaceId = factory.cls.get('workspaceId');
        const reader = await AccessTokenReader.create({
            ...accessTokenReaderFixture,
            workspaceId
        });
        const removeDisplayedTopicService = new RemoveDisplayedTopic({ context: {} });
        const listAccessTokenReadersService = new AccessTokenReadersList({ context: {} });

        await ReaderDisplayedTopic.create({
            ...readerDisplayedTopic,
            workspaceId // rewrite workspaceId to current one
        });

        const result = await removeDisplayedTopicService.run({
            accessTokenReaderId : reader.id,
            topic               : readerDisplayedTopic.topic
        });
        const { data: [ resultReader ] } = await listAccessTokenReadersService.run({});

        expect(result).toMatchObject({
            data : { displayedTopics: [] }
        });
        expect(resultReader.displayedTopics).toHaveLength(0);
    }));

    test('NEGATIVE: should throw not found error on removing not-existent topic', factory.wrapInRollbackTransaction(async () => {
        const removeDisplayedTopicService = new RemoveDisplayedTopic({ context: {} });

        await expect(removeDisplayedTopicService.run({
            accessTokenReaderId : accessTokenReaderFixture.id,
            topic               : readerDisplayedTopic.topic
        }))
        .rejects
        .toThrowError(NotFoundError);
    }));
});
