# Create reported issue

## Request

    POST /api/v1/admin/reported-issues

##### Body
```JSON5
{
    "message": "Something went wrong",  // required
    "type": "web_app"                   // required
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": 1633950838816908,
        "type": "web_app",
        "message": "Something went wrong",
        "status": "pending",
        "adminId": "1631884872643797",
        "createdAt": "2021-10-11T11:13:58.239Z",
        "updatedAt": "2021-10-11T11:13:58.239Z"
    }
}
```