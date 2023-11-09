# Deactivate notifications

## Request
    PATCH /api/v1/admin/notifications/deactivate

##### Body
```JSON5
{
    "ids": ["1633454173357221"] // list of notification ids
}
```

## Response

```JSON5
{
    "status": 1,
    "ids": [
        "1633454173357221"
    ],
    "meta": {
        "affectedCount": 1
    }
}
```