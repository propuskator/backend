# Get list of notifications

## Request
    GET /api/v1/admin/notifications

##### GET parameters
```
ids - optional, list of ids to filter
isRead - optional, true/false
limit - optional, default:0, limit of notification count 
offset - optional, default: 0, offset
updateStart - optional, date
types - optional, list of types 'UNAUTH_SUBJECT_ACCESS,DELETED_SUBJECT_PROFILE,ACTIVE_READER,UNAUTH_SUBJECT_PHN_ACCESS,UNKNOWN_TOKEN,INACTIVE_READER,NEW_READER,UNAUTH_ACCESS,UNAUTH_BUTTON_ACCESS'
updateEnd - optional, date
createStart - optional, date
createEnd - optional, date




```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633454173357221",
            "type": "INACTIVE_READER",
            "data": null,
            "message": "Точка доступа Modbus reader 4 недоступна",
            "isRead": true,
            "createdAt": "2021-10-05T17:16:13.211Z",
            "updatedAt": "2021-10-08T16:59:23.402Z",
            "accessSubject": null,
            "accessSubjectToken": null,
            "accessTokenReader": {
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
            }
        },
        {
            "id": "1633454171262697",
            "type": "INACTIVE_READER",
            "data": null,
            "message": "Точка доступа Modbus reader 3 недоступна",
            "isRead": true,
            "createdAt": "2021-10-05T17:16:11.628Z",
            "updatedAt": "2021-10-08T16:59:23.402Z",
            "accessSubject": null,
            "accessSubjectToken": null,
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
            }
        },
        {
            "id": "1633454168193354",
            "type": "INACTIVE_READER",
            "data": null,
            "message": "Точка доступа Modbus reader 2 недоступна",
            "isRead": true,
            "createdAt": "2021-10-05T17:16:08.424Z",
            "updatedAt": "2021-10-08T16:59:23.402Z",
            "accessSubject": null,
            "accessSubjectToken": null,
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
            }
        }
    ],
    "meta": {
        "filteredCount": 102,
        "total": 102,
        "unreadTotal": 0
    }
}
```