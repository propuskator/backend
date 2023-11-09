# Get list of access logs

## Request

    GET /api/v1/admin/access-logs

##### GET parameters
```
GET parameters
ids - optional, list of ids to filter
search - optional
accessSubjectTokenIds - optional, list of accessSubjectToken ids
accessTokenReaderIds - optional, list of accessTokenReader ids
accessSubjectIds - optional, list of accessSubject ids
accessSubjectIds - optional, list of accessSubject ids
status - optional, SUCCESS/DENIED
createStart - optional, date
createEnd - optional, date
limit - optional, default: 20, limit
offset - optional, default: 0, offset
offset - optional, default: 0, offset
sortedBy - optional, default: createdAt, createdAt/subjectName/tokenCode/status/readerName
order - optional, default: DESC, ASC/DESC
initiatorType - optional, possible values: PHONE/SUBJECT/ACCESS_POINT/BUTTON
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633453265738955",
            "accessTokenReaderId": "1631884913599165",
            "accessSubjectTokenId": "1631884930944655",
            "accessSubjectId": "1631885019231767",
            "status": "SUCCESS",
            "initiatorType": "ACCESS_POINT",
            "attemptedAt": "2021-10-05T17:00:47.000Z",
            "createdAt": "2021-10-05T17:01:05.206Z",
            "accessTokenReader": {
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
            "accessSubjectToken": {
                "id": "1631884930944655",
                "accessSubjectId": null,
                "name": "49437C",
                "code": "49437C",
                "type": null,
                "enabled": true,
                "isArchived": false,
                "assignedAt": "2021-10-08T18:51:09.448Z",
                "createdAt": "2021-09-17T13:22:10.064Z",
                "updatedAt": "2021-09-17T13:22:10.064Z"
            },
            "accessSubject": {
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
                "updatedAt": "2021-10-08T18:51:09.459Z",
                "userId": null,
                "registered": false,
                "canAttachTokens": true
            }
        },
        {
            "id": "1633453268125924",
            "accessTokenReaderId": "1631884913550004",
            "accessSubjectTokenId": "1631884923827104",
            "accessSubjectId": "1631885006293998",
            "status": "SUCCESS",
            "initiatorType": "ACCESS_POINT",
            "attemptedAt": "2021-10-05T17:00:47.000Z",
            "createdAt": "2021-10-05T17:01:08.443Z",
            "accessTokenReader": {
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
            "accessSubjectToken": {
                "id": "1631884923827104",
                "accessSubjectId": "1631885006293998",
                "name": "B15077",
                "code": "B15077",
                "type": null,
                "enabled": true,
                "isArchived": false,
                "assignedAt": null,
                "createdAt": "2021-09-17T13:22:03.067Z",
                "updatedAt": "2021-09-17T13:22:03.067Z"
            },
            "accessSubject": {
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
            }
        },
        {
            "id": "1633453271561398",
            "accessTokenReaderId": "1631884913703779",
            "accessSubjectTokenId": "1631884925698545",
            "accessSubjectId": "1631884982726866",
            "status": "SUCCESS",
            "initiatorType": "ACCESS_POINT",
            "attemptedAt": "2021-10-05T17:00:46.000Z",
            "createdAt": "2021-10-05T17:01:11.629Z",
            "accessTokenReader": {
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
            },
            "accessSubjectToken": {
                "id": "1631884925698545",
                "accessSubjectId": "1633718086122431",
                "name": "3F00B9",
                "code": "3F00B9",
                "type": null,
                "enabled": true,
                "isArchived": false,
                "assignedAt": "2021-10-08T18:21:48.659Z",
                "createdAt": "2021-09-17T13:22:05.702Z",
                "updatedAt": "2021-09-17T13:22:05.702Z"
            },
            "accessSubject": {
                "id": "1631884982726866",
                "name": "nameеуіе",
                "fullName": "nameеуіе (position)",
                "position": "position",
                "email": "email@email.com",
                "phone": "+380930000000",
                "phoneEnabled": true,
                "avatar": "node-static/access-subjects/c4b6d27e-bff8-4c11-81a9-f5f64c9d3754",
                "avatarColor": "#5ADBDB",
                "enabled": true,
                "isArchived": false,
                "isInvited": false,
                "mobileEnabled": true,
                "showReaderGroups": false,
                "accessSubjectTokens": null,
                "createdAt": "2021-09-17T13:23:02.141Z",
                "updatedAt": "2021-10-08T18:33:28.921Z",
                "userId": null,
                "registered": false,
                "canAttachTokens": true
            }
        },
        {
            "id": "1633453265586964",
            "accessTokenReaderId": "1631884913599165",
            "accessSubjectTokenId": "1631884930944655",
            "accessSubjectId": "1631885019231767",
            "status": "SUCCESS",
            "initiatorType": "ACCESS_POINT",
            "attemptedAt": "2021-10-05T16:59:45.000Z",
            "createdAt": "2021-10-05T17:01:05.206Z",
            "accessTokenReader": {
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
            "accessSubjectToken": {
                "id": "1631884930944655",
                "accessSubjectId": null,
                "name": "49437C",
                "code": "49437C",
                "type": null,
                "enabled": true,
                "isArchived": false,
                "assignedAt": "2021-10-08T18:51:09.448Z",
                "createdAt": "2021-09-17T13:22:10.064Z",
                "updatedAt": "2021-09-17T13:22:10.064Z"
            },
            "accessSubject": {
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
                "updatedAt": "2021-10-08T18:51:09.459Z",
                "userId": null,
                "registered": false,
                "canAttachTokens": true
            }
        },
        {
            "id": "1633453268680402",
            "accessTokenReaderId": "1631884913550004",
            "accessSubjectTokenId": "1631884923827104",
            "accessSubjectId": "1631885006293998",
            "status": "SUCCESS",
            "initiatorType": "ACCESS_POINT",
            "attemptedAt": "2021-10-05T16:59:45.000Z",
            "createdAt": "2021-10-05T17:01:08.443Z",
            "accessTokenReader": {
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
            "accessSubjectToken": {
                "id": "1631884923827104",
                "accessSubjectId": "1631885006293998",
                "name": "B15077",
                "code": "B15077",
                "type": null,
                "enabled": true,
                "isArchived": false,
                "assignedAt": null,
                "createdAt": "2021-09-17T13:22:03.067Z",
                "updatedAt": "2021-09-17T13:22:03.067Z"
            },
            "accessSubject": {
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
            }
        }
    ],
    "meta": {
        "filteredCount": 710,
        "total": 710
    }
}
```