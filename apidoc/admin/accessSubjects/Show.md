# Show access subject


## Request
    GET /api/v1/admin/access-subjects/:id

##### URL parameters
```
id - subject id
```

## Response

```JSON5
{
    "status": 1,
    "data": {
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
}
```