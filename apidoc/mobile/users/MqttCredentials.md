# Show admin mqtt credentials

## Request
    GET /api/v1/mobile/mqttCredentials

## Response

```JSON5
{
    "status": 1,
    "data": {
        "rootTopic": "2d6a54389b91a7f61c123211e2ebf2fef47dee2f28c727c46b9bf4203c80f0da",
        "username": "user/1631884872710453/email@email.com",
        "password": "ayCD3-BEMoXMIl3z36Eyx4hq",
        "syncMaxDelay": 10000,
        "syncResetTimeout": 1000
    }
}
```