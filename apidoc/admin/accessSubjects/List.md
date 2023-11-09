# Get list of access subjects

## Request
    GET /api/v1/admin/access-subjects

##### GET parameters
```
ids - optional, list of ids to filter
search - optional
accessSubjectTokenId - optional, accessSubjectToken ids
enabled - optional, true/false
isArchived - optional, true/false
updateStart - optional, date
updateEnd - optional, date
createStart - optional, date
createEnd - optional, date
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: createdAt, fullName/enabled/createdAt/updatedAt/popularityCoef
order - optional, default: DESC, ASC/DESC
```

## Response

```JSON5
{
    "status": 1,
    "data": [
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
            "accessSubjectTokens": [
                {
                    "id": "1631884930944655",
                    "accessSubjectId": "1631885019231767",
                    "name": "49437C",
                    "code": "49437C",
                    "type": null,
                    "enabled": true,
                    "isArchived": false,
                    "assignedAt": null,
                    "createdAt": "2021-09-17T13:22:10.064Z",
                    "updatedAt": "2021-09-17T13:22:10.064Z"
                }
            ],
            "createdAt": "2021-09-17T13:23:39.366Z",
            "updatedAt": "2021-09-20T10:46:04.169Z",
            "userId": "1632134764883668",
            "registered": true,
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
            "accessSubjectTokens": [
                {
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
                }
            ],
            "createdAt": "2021-09-17T13:23:26.400Z",
            "updatedAt": "2021-09-17T13:23:26.400Z",
            "userId": null,
            "registered": false,
            "canAttachTokens": true
        },
        {
            "id": "1631884982726866",
            "name": "3",
            "fullName": "(name)",
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
            "accessSubjectTokens": [
                {
                    "id": "1631884925698545",
                    "accessSubjectId": "1631884982726866",
                    "name": "3F00B9",
                    "code": "3F00B9",
                    "type": null,
                    "enabled": true,
                    "isArchived": false,
                    "assignedAt": null,
                    "createdAt": "2021-09-17T13:22:05.702Z",
                    "updatedAt": "2021-09-17T13:22:05.702Z"
                }
            ],
            "createdAt": "2021-09-17T13:23:02.141Z",
            "updatedAt": "2021-09-17T13:23:02.141Z",
            "userId": null,
            "registered": false,
            "canAttachTokens": true
        }
    ],
    "meta": {
        "filteredCount": 3,
        "total": 3
    }
}
```