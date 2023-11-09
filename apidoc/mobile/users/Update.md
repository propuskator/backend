# Refresh api token

## Request

    PATCH /api/v1/mobile/profile

##### Body
```JSON5
{
    "newPassword": "newPassword",// optional
    "passwordConfirm": "newPassword",// optional
    "oldPassword": "admin",// optional
}
```

## Response
* `meta.newToken` is set only if login or password has been changed
```JSON5
{
    "status": 1,
    "data": {
        "id": "1633961163769624",
        "email": "email@email.com",
        "createdAt": "2021-10-11T14:06:03.842Z",
        "updatedAt": "2021-10-11T14:33:28.161Z"
    },
    "meta": {
        "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzOTYxMTYzNzY5NjI0IiwiaWF0IjoxNjMzOTYyODA4fQ.IX10XPR1NkODwhGaEcNB4hASv_uEHeWJ_KqwP-aFiE8"
    }
}
```