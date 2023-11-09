# Refresh api token

## Request

    PATCH /api/v1/admin/access-api-settings/refresh

## Response

```JSON5
{
    "status": 1,
    "data": {
        "url": "http://localhost",
        "emqxTcpPort": 1883,
        "token": "mHA_sBfraexCstydXaWw",
        "cert": "certificate"
    }
}
```