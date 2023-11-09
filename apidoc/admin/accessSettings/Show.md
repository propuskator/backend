# Show access setting


## Request
    GET /api/v1/admin/access-settings/:id

##### URL parameters
```
id - setting id
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1631885033778611",
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
            },
            {
                "id": "1631885006293998",
                "name": "2",
                "fullName": "2",
                "position": null,
                "email": "s2@gmail.com",
                "phone": "+444444444444",
                "phoneEnabled": false,
                "avatar": null,
                "avatarColor": "#3093CA",
                "enabled": true,
                "isArchived": false,
                "isInvited": true,
                "mobileEnabled": true,
                "showReaderGroups": false,
                "accessSubjectTokens": null,
                "createdAt": "2021-09-17T13:23:26.400Z",
                "updatedAt": "2021-09-17T13:23:26.400Z",
                "userId": null,
                "registered": false,
                "canAttachTokens": true
            },
            {
                "id": "1631885019231767",
                "name": "1",
                "fullName": "1",
                "position": null,
                "email": "s1@gmail.com",
                "phone": "+444444444445",
                "phoneEnabled": false,
                "avatar": null,
                "avatarColor": "#BFEB61",
                "enabled": true,
                "isArchived": false,
                "isInvited": true,
                "mobileEnabled": true,
                "showReaderGroups": false,
                "accessSubjectTokens": null,
                "createdAt": "2021-09-17T13:23:39.366Z",
                "updatedAt": "2021-09-20T10:46:04.169Z",
                "userId": "1632134764883668",
                "registered": true,
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
            },
            {
                "id": "1631884913550004",
                "code": "bridge-2",
                "name": "Modbus reader 2",
                "phone": null,
                "stateStatus": "DISCONNECTED",
                "connectionStatus": {
                    "color": "red",
                    "title": "Inactive"
                },
                "enabled": true,
                "isArchived": false,
                "activeAt": "2021-10-05T17:01:08.413Z",
                "createdAt": "2021-09-17T13:21:53.925Z",
                "updatedAt": "2021-09-20T10:55:10.262Z"
            },
            {
                "id": "1631884913599165",
                "code": "bridge-1",
                "name": "Modbus reader 1",
                "phone": null,
                "stateStatus": "DISCONNECTED",
                "connectionStatus": {
                    "color": "red",
                    "title": "Inactive"
                },
                "enabled": true,
                "isArchived": false,
                "activeAt": "2021-10-05T17:01:05.186Z",
                "createdAt": "2021-09-17T13:21:53.925Z",
                "updatedAt": "2021-09-20T12:10:14.620Z"
            },
            {
                "id": "1631884913692464",
                "code": "bridge-4",
                "name": "Modbus reader 4",
                "phone": null,
                "stateStatus": "DISCONNECTED",
                "connectionStatus": {
                    "color": "red",
                    "title": "Inactive"
                },
                "enabled": true,
                "isArchived": false,
                "activeAt": "2021-10-05T17:01:13.205Z",
                "createdAt": "2021-09-17T13:21:53.925Z",
                "updatedAt": "2021-09-20T10:54:51.403Z"
            },
            {
                "id": "1631884913703779",
                "code": "bridge-3",
                "name": "Modbus reader 3",
                "phone": null,
                "stateStatus": "DISCONNECTED",
                "connectionStatus": {
                    "color": "red",
                    "title": "Inactive"
                },
                "enabled": true,
                "isArchived": false,
                "activeAt": "2021-10-05T17:01:11.616Z",
                "createdAt": "2021-09-17T13:21:53.925Z",
                "updatedAt": "2021-09-20T10:55:14.132Z"
            }
        ],
        "accessReadersGroups": [],
        "createdAt": "2021-09-17T13:23:53.688Z",
        "updatedAt": "2021-09-20T11:56:55.597Z"
    }
}
```