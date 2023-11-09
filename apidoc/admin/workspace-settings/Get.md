# GET Workspace settings

## Request

    GET /api/v1/admin/workspace/settings

## Response

```JSON5
{
    "status": 1,
    "data": {
        "timezone": "(UTC+02:00) E. Europe",
        "notificationTypes": [
            "USER_ACTIONS",
            "READER_STATE",
            "ACCESS_ATTEMPTS"
        ],
        "allowCollectMedia": true
    }
}
```