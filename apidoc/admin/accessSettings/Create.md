# Create access setting

## Request
    POST /api/v1/admin/access-settings

##### Body
```JSON5
{
    "accessReadersGroupIds": [], // accessReadersGroup ids
    "accessTokenReaderIds": ["1631884913350155"], // accessTokenReader ids
    "accessScheduleIds": ["1632138766901313"], // accessSchedule ids
    "accessSubjectIds": ["1631884982726866"], // accessSubject ids
    "enabled" : true, // optional, default: true, true/false
    "isArchived" : false, //  optional, default: false,true/false
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1633714415991076",
        "enabled": true,
        "isArchived": false,
        "accessSubjects": [
            {
                "id": "1631884982726866",
                "name": "3",
                "fullName": "3",
                "position": null,
                "email": "s3@gmail.com",
                "phone": "+33333333333",
                "phoneEnabled": false,
                "avatar": null,
                "avatarColor": "#5ADBDB",
                "enabled": true,
                "isArchived": false,
                "isInvited": true,
                "mobileEnabled": true,
                "showReaderGroups": false,
                "accessSubjectTokens": null,
                "createdAt": "2021-09-17T13:23:02.141Z",
                "updatedAt": "2021-09-17T13:23:02.141Z",
                "userId": null,
                "registered": false,
                "canAttachTokens": true
            }
        ],
        "accessSchedules": [
            {
                "id": "1632138766901313",
                "name": "schedule122",
                "enabled": true,
                "isArchived": false,
                "createdAt": "2021-09-20T11:52:46.824Z",
                "updatedAt": "2021-10-08T17:20:01.422Z",
                "dates": [
                    {
                        "id": "1633713601693365",
                        "scheduleId": "1632138766901313",
                        "from": 1593170173244,
                        "to": 1593170173245,
                        "weekBitMask": [
                            1,
                            1,
                            0,
                            1,
                            1,
                            1,
                            1
                        ],
                        "monthBitMask": null,
                        "dailyIntervalStart": 60000,
                        "dailyIntervalEnd": 120000
                    }
                ]
            }
        ],
        "accessTokenReaders": [
            {
                "id": "1631884913350155",
                "code": "bridge-5",
                "name": "Modbus reader 5",
                "phone": null,
                "stateStatus": "DISCONNECTED",
                "connectionStatus": {
                    "color": "red",
                    "title": "Inactive"
                },
                "enabled": true,
                "isArchived": false,
                "activeAt": "2021-09-20T13:55:14.755Z",
                "createdAt": "2021-09-17T13:21:53.925Z",
                "updatedAt": "2021-09-20T10:55:17.647Z"
            }
        ],
        "accessReadersGroups": [],
        "createdAt": "2021-10-08T17:33:35.397Z",
        "updatedAt": "2021-10-08T17:33:35.397Z"
    }
}
```