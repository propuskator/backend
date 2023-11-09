# Disable access subject token

## Request
    POST /api/v1/mobile/access-subject-tokens/:id/disable

##### params
id - number, id of access-subject-token

## Response

```JSON5
{
    "status": 1,
    "data": {
        "enabled": false
    }
}
```