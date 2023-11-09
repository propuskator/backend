# Refresh api token

## Request

    PATCH /api/v1/admin/profile

##### Body
```JSON5
{
    "login": "name123",// optional, unique admin login
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
        "id": "1633867822644004",
        "login": "admin@admin.com",
        "avatar": null,
        "createdAt": "2021-10-10T12:10:22.141Z",
        "updatedAt": "2021-10-10T12:16:27.816Z"
    },
    "meta": {
        "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzODY3ODIyNjQ0MDA0IiwiaWF0IjoxNjMzODY4MTg3fQ.-AD48ElFFLr1OPAR1yC1NYoj8w3igEuaDH3IyC6CgyA"
    }
}
```