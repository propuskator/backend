const crypto = require('crypto');
const fs     = require('fs');

const { when } = require('jest-when');

const mockS3ClientUploadAsync = jest.fn();
const mockS3ClientDeleteObjectsAsync = jest.fn();
const mockBucketName = 'fake-bucket';

jest.mock('../../../../../lib/utils/s3Client.js', () => ({
    __esModule: true,
    default : {
        uploadAsync   : mockS3ClientUploadAsync,
        deleteObjects : mockS3ClientDeleteObjectsAsync
    },
    BUCKET_NAME : mockBucketName
}));

const mockWaitForMediaFileIntegrity = jest.fn();

jest.mock('../../../../../lib/utils/media.js', () => ({
    waitForMediaFileIntegrity : mockWaitForMediaFileIntegrity
}));

const TestFactory                   = require('../../../../utils');
const AccessSubjectTokensCreate     = require('../../../../../lib/services/admin/accessSubjectTokens/Create');
const AccessTokenReaderCreate       = require('../../../../../lib/services/admin/accessTokenReaders/Create');
const AccessLogsList                = require('../../../../../lib/services/admin/accessLogs/List');
const [ accessTokenReaderFixture ]  = require('../../../../fixtures/accessTokenReaders');
const [ accessSubjectTokenFixture ] = require('../../../../fixtures/accessSubjectTokens');
const AccessTokenReader             = require('../../../../../lib/models/AccessTokenReader');
const Workspace                     = require('../../../../../lib/models/Workspace');
const config                        = require('../../../../../lib/config');
const Notification                  = require('../../../../../lib/models/Notification');
const NotificationsList             = require('../../../../../lib/services/admin/notifications/List');
const [ accessTokenReader ]         = require('../../../../fixtures/accessTokenReaders');
const [ accessSubjectToken ]        = require('../../../../fixtures/accessSubjectTokens');
const [ accessSubject ]             = require('../../../../fixtures/accessSubjects');
const { default: AccessSubject }    = require('../../../../../lib/models/AccessSubject');
const { 
    SECONDS_IN_MINUTE,
    MILLISECONDS_IN_SECOND
} = require('../../../../../lib/constants/common');
const { 
    default: AccessLog,
    INITIATOR_TYPES
} = require('../../../../../lib/models/AccessLog.js');
const { 
    default : AccessLogsSave,
    SPECIAL_CODES
} = require('../../../../../lib/services/tokenReader/v1/accessLogs/Save');

describe('tokenReader AccessLogs Save', () => {
    const factory = new TestFactory();

    beforeAll(async () => {
        await factory.initializeWorkspace();
    });

    afterAll(async () => {
        await factory.end();
    });

    test('POSITIVE: it should upload suitable logs recorded media to S3 bucket', factory.wrapInRollbackTransaction(async () => {
        jest.useFakeTimers();

        const CAMERAS_MEDIA_COLLECT_FRAMES_INTERVAL_TIME =
            +config.camerasMedia.collectFramesIntervalTime * MILLISECONDS_IN_SECOND;
        const CAMERAS_MEDIA_COLLECT_FRAMES_ACCURACY_TIME =
            +config.camerasMedia.collectFramesAccuracyTime * MILLISECONDS_IN_SECOND;
        const ONE_MINUTE_IN_MILLISECONDS = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

        const logTime = 1635428382;
        const code = accessSubjectTokenFixture.code;
        const status = 1;

        Workspace.findByPkOrFail = jest.fn();

        when(Workspace.findByPkOrFail).mockResolvedValue({
            notificationTypes : "USER_ACTIONS/READER_STATE/ACCESS_ATTEMPTS",
            timezone: "(UTC+02:00) E. Europe",
            allowCollectMedia : true
        });

        const { data: accessTokenReader } = await new AccessTokenReaderCreate({ context: { workspaceId: 1 } }).run({
            name : accessTokenReaderFixture.name,
            code : accessTokenReaderFixture.code
        });
        await new AccessSubjectTokensCreate({ context: { workspaceId: 1 } }).run({
            name : accessSubjectTokenFixture.name,
            code : accessSubjectTokenFixture.code
        });

        const rtspUrl = 'rtsp://fake-host';
        const rtspUrlHash = crypto.createHash('sha256').update(rtspUrl).digest('hex');
        const framesPaths = [
            `/fake/path/cameras/${rtspUrlHash}/frames/${logTime - 1}000.png`,
            `/fake/path/cameras/${rtspUrlHash}/frames/${logTime}000.png`,
            `/fake/path/cameras/${rtspUrlHash}/frames/${logTime + 1}000.png`
        ];
        const videosPaths = [
            `/fake/path/cameras/${rtspUrlHash}/videos/${logTime - 1}000.mp4`,
            `/fake/path/cameras/${rtspUrlHash}/videos/${logTime}000.mp4`
        ];
        const expectedFramesObjects = [
            {
                Key : `cameras/${rtspUrlHash}/frames/${logTime - 1}000.png`
            },
            {
                Key : `cameras/${rtspUrlHash}/frames/${logTime}000.png`
            },
            {
                Key : `cameras/${rtspUrlHash}/frames/${logTime + 1}000.png`
            }
        ];
        const expectedVideosObjects = [
            {
                Key : `cameras/${rtspUrlHash}/videos/${logTime - 1}000.mp4`
            },
            {
                Key : `cameras/${rtspUrlHash}/videos/${logTime}000.mp4` 
            }
        ];
        const timeToWaitMediaUploading = 2000;

        const mockCamera = {
            getFramesNearestToTime : jest.fn().mockResolvedValue(framesPaths),
            getVideosNearestToTime : jest.fn().mockResolvedValue(videosPaths),
            getRtspUrlHash         : jest.fn().mockReturnValue(rtspUrlHash)
        };

        AccessTokenReader.findOne = jest.fn().mockResolvedValue({
            accessCameras : [ mockCamera ]
        });

        AccessTokenReader.findAll = jest.fn();
        
        
        when(AccessTokenReader.findAll).calledWith({
            where : {
                id : accessTokenReader.id
            },
            include : [
                {
                    association : 'accessCameras',
                    where       : {
                        enabled    : true,
                        isArchived : false,
                        deletedAt  : null
                    }
                }
            ],
            raw : true
        }).mockResolvedValue([ {}, {} ]);

        const mockFramesReadStreams = [ {}, {}, {} ];
        const mockVideosReadStreams = [ {}, {} ];

        fs.createReadStream = jest.fn();

        when(fs.createReadStream)
            .calledWith(framesPaths[0])
            .mockReturnValue(mockFramesReadStreams[0])
            .calledWith(framesPaths[1])
            .mockReturnValue(mockFramesReadStreams[1])
            .calledWith(framesPaths[2])
            .mockReturnValue(mockFramesReadStreams[2])
            .calledWith(videosPaths[0])
            .mockReturnValue(mockVideosReadStreams[0])
            .calledWith(videosPaths[1])
            .mockReturnValue(mockVideosReadStreams[1]);

        when(mockS3ClientUploadAsync)
            .calledWith({
                Bucket      : mockBucketName,
                Key         : expectedFramesObjects[0].Key,
                Body        : mockFramesReadStreams[0],
                ContentType : 'image/png'
            })
            .mockResolvedValue(expectedFramesObjects[0])
            .calledWith({
                Bucket      : mockBucketName,
                Key         : expectedFramesObjects[1].Key,
                Body        : mockFramesReadStreams[1],
                ContentType : 'image/png'
            })
            .mockResolvedValue(expectedFramesObjects[1])
            .calledWith({
                Bucket      : mockBucketName,
                Key         : expectedFramesObjects[2].Key,
                Body        : mockFramesReadStreams[2],
                ContentType : 'image/png'
            })
            .mockResolvedValue(expectedFramesObjects[2]);
        
        when(mockS3ClientUploadAsync)
            .calledWith({
                Bucket      : mockBucketName,
                Key         : expectedVideosObjects[0].Key,
                Body        : mockVideosReadStreams[0],
                ContentType : 'video/mp4'
            })
            .mockResolvedValue(expectedVideosObjects[0])
            .calledWith({
                Bucket      : mockBucketName,
                Key         : expectedVideosObjects[1].Key,
                Body        : mockVideosReadStreams[1],
                ContentType : 'video/mp4'
            })
            .mockResolvedValue(expectedVideosObjects[1]);

        // To create proper dump for the logs list service
        config.s3.bucket = mockBucketName;
        
        const expectedSavedLog = expect.objectContaining({
            accessTokenReaderId : `${accessTokenReader.id}`,
            status              : AccessLog.STATUS_SUCCESS,
            // Frames and videos arrays should be sorted by originCreatedAt property in ascending order.
            // Also, extract one minute from each frame originCreatedAt property because it is time which was 
            // in the RTSP stream when started recording frame: ffmpeg utility records 1/60 part of frame per 
            // second and after one minute it writes frame to a file with current system timestamp in
            // name(not the actual time when started recording this frame)
            recordedMedia       : { 
                frames : [
                    {
                        path            : `${mockBucketName}/cameras/${rtspUrlHash}/frames/${logTime - 1}000.png`,
                        originCreatedAt : new Date((logTime - 1) * 1000 - ONE_MINUTE_IN_MILLISECONDS) 
                    },
                    {
                        path            : `${mockBucketName}/cameras/${rtspUrlHash}/frames/${logTime}000.png`,
                        originCreatedAt : new Date((logTime) * 1000 - ONE_MINUTE_IN_MILLISECONDS) 
                    },
                    {
                        path            : `${mockBucketName}/cameras/${rtspUrlHash}/frames/${logTime + 1}000.png`,
                        originCreatedAt : new Date((logTime + 1) * 1000 - ONE_MINUTE_IN_MILLISECONDS)
                    }
                ],
                videos : [
                    {
                        path            : `${mockBucketName}/cameras/${rtspUrlHash}/videos/${logTime - 1}000.mp4`,
                        originCreatedAt : new Date((logTime - 1) * 1000) 
                    },
                    {
                        path            : `${mockBucketName}/cameras/${rtspUrlHash}/videos/${logTime}000.mp4`,
                        originCreatedAt : new Date((logTime) * 1000)
                    }
                ]
            }
        });

        const accessLogsSaveService = new AccessLogsSave({ context: { tokenReaderId: accessTokenReader.id, workspaceId: 1 } });
        const body = `${logTime}_${code}_${status}`;

        await accessLogsSaveService.run({ body });

        // Wait for a time while the service should collect the last frame
        jest.advanceTimersByTime(
            (
                CAMERAS_MEDIA_COLLECT_FRAMES_INTERVAL_TIME +
                CAMERAS_MEDIA_COLLECT_FRAMES_ACCURACY_TIME
            ) * 2
        );
        jest.useRealTimers();

        // Uploading to S3 runs in background, so we need to wait for a while for this operations
        // to retrieve recorded media in logs list
        await new Promise(resolve => setTimeout(resolve, timeToWaitMediaUploading));

        const { data: logsList } = await new AccessLogsList({ context: {} }).run({});

        expect(mockS3ClientUploadAsync.mock.calls).toHaveLength(5);
        expect(mockS3ClientUploadAsync.mock.calls).toContainEqual([{
            Bucket      : mockBucketName,
            Key         : expectedFramesObjects[0].Key,
            Body        : mockFramesReadStreams[0],
            ContentType : 'image/png'
        }]);
        expect(mockS3ClientUploadAsync.mock.calls).toContainEqual([{
            Bucket      : mockBucketName,
            Key         : expectedFramesObjects[1].Key,
            Body        : mockFramesReadStreams[1],
            ContentType : 'image/png'
        }]);
        expect(mockS3ClientUploadAsync.mock.calls).toContainEqual([{
            Bucket      : mockBucketName,
            Key         : expectedFramesObjects[2].Key,
            Body        : mockFramesReadStreams[2],
            ContentType : 'image/png'
        }]);
        expect(mockS3ClientUploadAsync.mock.calls).toContainEqual([{
            Bucket      : mockBucketName,
            Key         : expectedVideosObjects[0].Key,
            Body        : mockVideosReadStreams[0],
            ContentType : 'video/mp4'
        }]);
        expect(mockS3ClientUploadAsync.mock.calls).toContainEqual([{
            Bucket      : mockBucketName,
            Key         : expectedVideosObjects[1].Key,
            Body        : mockVideosReadStreams[1],
            ContentType : 'video/mp4'
        }]);

        expect(mockWaitForMediaFileIntegrity.mock.calls).toContainEqual([ videosPaths[0], expect.any(Object) ]);
        expect(mockWaitForMediaFileIntegrity.mock.calls).toContainEqual([ videosPaths[1], expect.any(Object) ]);

        expect(logsList).toContainEqual(expectedSavedLog);
    }));

    test('POSITIVE: save access logs', factory.wrapInRollbackTransaction(async () => {
        const tokenReader = await AccessTokenReader.create(accessTokenReader);

        Workspace.findByPkOrFail = jest.fn();

        when(Workspace.findByPkOrFail).mockResolvedValue({
            notificationTypes : "USER_ACTIONS/READER_STATE/ACCESS_ATTEMPTS",
            timezone: "(UTC+02:00) E. Europe",
            allowCollectMedia : true
        });

        AccessTokenReader.findAll = jest.fn();
        
        
        when(AccessTokenReader.findAll).calledWith({
            where : {
                id : accessTokenReader.id
            },
            include : [
                {
                    association : 'accessCameras',
                    where       : {
                        enabled    : true,
                        isArchived : false,
                        deletedAt  : null
                    }
                }
            ],
            raw : true
        }).mockResolvedValue([ {}, {} ]);

        await (new AccessSubjectTokensCreate({ context: {} })).run(accessSubjectToken);

        // create subject to refers to his virtual code in AccessLogsSave service
        const subject = await AccessSubject.create(accessSubject);

        const service = new AccessLogsSave({
            context : {
                tokenReaderId     : tokenReader.id,
                accessTokenReader : tokenReader
            }
        });
        const accessLogsData = [
            {
                time   : 323213312,
                code   : accessSubjectToken.code,
                status : 1
            },
            {
                time   : 323213313,
                code   : accessSubjectToken.code,
                status : 0
            },
            {
                time   : 323213314,
                code   : subject.mobileToken,
                status : 1
            },
            {
                time   : 323213315,
                code   : subject.phoneToken,
                status : 0
            },
            {
                time   : 323213316,
                code   : SPECIAL_CODES.BUTTON_CODE,
                status : 0
            },
            {
                time   : 323213317,
                code   : SPECIAL_CODES.ALARM_CODE,
                status : 1
            },
            {
                time   : 323213318,
                code   : SPECIAL_CODES.ALARM_CODE,
                status : 0
            }
        ];
        const accessLogsStrings = accessLogsData.map(({ time, code, status }) => `${time}_${code}_${status}`);

        const res = await service.run({
            body : accessLogsStrings.join(',')
        });

        expect(res).toEqual(`ok,${accessLogsStrings.length}`);

        const resultAccessLogsList = await(new AccessLogsList({ context: {} })).run({
            sortedBy : 'attemptedAt',
            order    : 'ASC'
        });
        const resultNotificationsList = await new NotificationsList({ context: {} }).run({});

        const expectedAccessLogsList = [
            {
                status             : AccessLog.STATUS_SUCCESS,
                accessSubjectToken : { code: accessLogsData[0].code },
                initiatorType      : INITIATOR_TYPES.ACCESS_POINT,
                attemptedAt        : new Date(accessLogsData[0].time * 1000)
            },
            {
                status             : AccessLog.STATUS_DENIED,
                accessSubjectToken : { code: accessLogsData[1].code },
                initiatorType      : INITIATOR_TYPES.ACCESS_POINT,
                attemptedAt        : new Date(accessLogsData[1].time * 1000)
            },
            {
                status        : AccessLog.STATUS_SUCCESS,
                accessSubject : { virtualCode: accessSubject.virtualCode },
                initiatorType : INITIATOR_TYPES.SUBJECT,
                attemptedAt   : new Date(accessLogsData[2].time * 1000)
            },
            {
                status        : AccessLog.STATUS_DENIED,
                accessSubject : { virtualCode: accessSubject.virtualCode },
                initiatorType : INITIATOR_TYPES.PHONE,
                attemptedAt   : new Date(accessLogsData[3].time * 1000)
            },
            {
                status        : AccessLog.STATUS_DENIED,
                initiatorType : INITIATOR_TYPES.BUTTON,
                attemptedAt   : new Date(accessLogsData[4].time * 1000) 
            },
            {
                status        : AccessLog.STATUS_ALARM_ON,
                initiatorType : INITIATOR_TYPES.ALARM,
                attemptedAt   : new Date(accessLogsData[5].time * 1000)
            },
            {
                status        : AccessLog.STATUS_ALARM_OFF,
                initiatorType : INITIATOR_TYPES.ALARM,
                attemptedAt   : new Date(accessLogsData[6].time * 1000)
            }
        ];

        expect(resultAccessLogsList.data).toMatchObject(expectedAccessLogsList);
        expect(resultNotificationsList.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type : Notification.types.ACCESS_ATTEMPTS.UNAUTH_ACCESS,
                    data : {
                        tokenCode : accessSubjectToken.code
                    },
                    accessTokenReader : expect.objectContaining({
                        id    : accessTokenReader.id,
                        name  : accessTokenReader.name,
                        phone : accessTokenReader.phone
                    })
                }),
                expect.objectContaining({
                    type              : Notification.types.ACCESS_ATTEMPTS.UNAUTH_SUBJECT_PHN_ACCESS,
                    accessTokenReader : expect.objectContaining({
                        id    : accessTokenReader.id,
                        name  : accessTokenReader.name,
                        phone : accessTokenReader.phone
                    })
                }),
                expect.objectContaining({
                    type              : Notification.types.ACCESS_ATTEMPTS.SECURITY_SYSTEM_ACCESS_ON,
                    data : {
                        tokenCode : SPECIAL_CODES.ALARM_CODE
                    },
                    message           : '',
                    accessTokenReader : expect.objectContaining({
                        id    : accessTokenReader.id,
                        name  : accessTokenReader.name,
                        phone : accessTokenReader.phone
                    })
                }),
                expect.objectContaining({
                    type              : Notification.types.ACCESS_ATTEMPTS.SECURITY_SYSTEM_ACCESS_OFF,
                    data : {
                        tokenCode : SPECIAL_CODES.ALARM_CODE
                    },
                    message           : '',
                    accessTokenReader : expect.objectContaining({
                        id    : accessTokenReader.id,
                        name  : accessTokenReader.name,
                        phone : accessTokenReader.phone
                    })
                })
            ])
        )
    }));
});
