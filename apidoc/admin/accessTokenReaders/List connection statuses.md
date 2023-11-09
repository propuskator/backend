# Get list of access token readers connection statuses

## Request
    GET /api/v1/admin/access-token-readers/connection-statuses

## Response

```JSON5
{
    "status": 1,
    "data": {
        "ACTIVE": "Active",
        "SLEEPING": "Sleeping",
        "INIT": "Init",
        "CONNECTION_PROBLEM": "Connection problem",
        "INACTIVE": "Inactive"
    }
}
```