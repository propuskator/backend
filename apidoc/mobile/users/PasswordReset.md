# Reset subject user's password

## Request
    POST /api/v1/mobile/passwordReset

## Request
```JSON5
{
    "token": "token from RequestPasswordReset response",
    "code": "6-digit code from email",
	"password":"2SmartAccess",
	"passwordConfirm":"2SmartAccess"
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
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
        "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzOTYxMTYzNzY5NjI0IiwiaWF0IjoxNjMzOTYxMTYzfQ.BhRFgVMB3YVd6yR-hjMkL6xckDsaGz3aV2JRduP0k9M"
    }
}
```