# Show api token

## Request

    GET /api/v1/admin/access-api-settings

## Response

```JSON5
{
    "status": 1,
    "data": {
        "url": "http://localhost",
        "emqxTcpPort": 1883,
        "token": "mHA_sBfraexCstydXaWw",
        "cert": "certificate",
        "requestSubjectRegistration": {
            "deepLinkUrl": "<deep-link-url>",
            "qrCode": "<qr-code>"
        }
    }
}
```