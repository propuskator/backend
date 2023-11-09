# Create access subject

## Request
    POST /api/v1/admin/access-subjects

##### Body
```JSON5
{
    "avatarImg": {
        "buffer"       : "buffer", // avatar data buffer
        "mimetype"     : "image/png", // type of image
        "originalname" : "name" // original name of file
    },
    "name":"name",// required, first name
    "position":"position",// optional, position
    "email": "email@email.com",// optional, email
    "phone": "+380930000000",// optional, phone
    "phoneEnabled": true,
    "accessSubjectTokenIds": ["1631884925698545"],// optional, accessSubjectToken ids
    "mobileEnabled": true,// bollean, default true
    "sendInvitation": false,//bollean, default false
    "canAttachTokens": true// bollean, default false,
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1633715903843480",
        "name": "name",
        "fullName": "name (position)",
        "position": "position",
        "email": "email@email.com",
        "phone": "+380930000000",
        "phoneEnabled": true,
        "avatar": null,
        "avatarColor": "#04B149",
        "enabled": true,
        "isArchived": false,
        "isInvited": false,
        "mobileEnabled": true,
        "showReaderGroups": false,
        "accessSubjectTokens": [
            {
                "id": "1631884925698545",
                "accessSubjectId": "1633715903843480",
                "name": "3F00B9",
                "code": "3F00B9",
                "type": null,
                "enabled": true,
                "isArchived": false,
                "assignedAt": "2021-10-08T17:58:16.297Z",
                "createdAt": "2021-09-17T13:22:05.702Z",
                "updatedAt": "2021-09-17T13:22:05.702Z"
            }
        ],
        "createdAt": "2021-10-08T17:58:23.646Z",
        "updatedAt": "2021-10-08T17:58:23.646Z",
        "userId": null,
        "registered": false,
        "canAttachTokens": true
    },
    "meta": {
        "invitationSentSuccessfully": true
    }
}
```