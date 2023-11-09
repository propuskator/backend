# Register subject user

## Request
    POST /api/v1/mobile/register

## Request
```JSON5
{
    "workspace": "qwe",
    "email": "email@email.com",
	"password":"2SmartAccess",
	"passwordConfirm":"2SmartAccess"
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "email": "email@email.com",
        "user": {
            "id": "1633961163769624",
            "email": "email@email.com",
            "createdAt": "2021-10-11T14:06:03.842Z",
            "updatedAt": "2021-10-11T14:06:03.842Z"
        },
        "accessSubject": {
            "id": "1631884982726866",
            "name": "nameеуіе",
            "fullName": "nameеуіе (position)",
            "position": "position",
            "email": "email@email.com",
            "phone": "+380930000000",
            "avatar": "node-static/access-subjects/c4b6d27e-bff8-4c11-81a9-f5f64c9d3754",
            "workspaceAvatar": null,
            "avatarColor": "#5ADBDB",
            "createdAt": "2021-09-17T13:23:02.141Z",
            "updatedAt": "2021-10-08T18:33:28.921Z",
            "canAttachTokens": true
        }
    },
    "meta": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzOTYxMTYzNzY5NjI0IiwiaWF0IjoxNjMzOTYxMTYzfQ.BhRFgVMB3YVd6yR-hjMkL6xckDsaGz3aV2JRduP0k9M"
    }
}
```