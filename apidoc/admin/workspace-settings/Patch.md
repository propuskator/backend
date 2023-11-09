# PATCH Workspace settings

## Request

    PATCH /api/v1/admin/workspace/settings

##### Body
```JSON5
{
    "notificationTypes": ["USER_ACTIONS", "READER_STATE", "ACCESS_ATTEMPTS"],
    "timezone": "(UTC+02:00) E. Europe",
    "allowCollectMedia": true
}
```

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