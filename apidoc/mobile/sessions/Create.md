# Create jwt tokens

## Request

    POST /api/v1/mobile/login

##### Body1
```JSON5
{
    "workspace": "qwe",// required, workspace
    "email": "email@email.com",// required, email
    "password": "2SmartAccess"// required, password
}
```

##### Body2
```JSON5
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzOTYxMTYzNzY5NjI0IiwiaWF0IjoxNjM0MDMxOTE4fQ.2bFNEB7NGJzUNxKYrV9rnIUQDN-l5VE9g0kkFbNINWg"
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
            "updatedAt": "2021-10-11T14:06:03.849Z",
            "canAttachTokens": true
        },
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzOTYxMTYzNzY5NjI0IiwiaWF0IjoxNjM0MDMxOTE4fQ.2bFNEB7NGJzUNxKYrV9rnIUQDN-l5VE9g0kkFbNINWg"
    }
}
```