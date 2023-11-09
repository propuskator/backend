# Create access reader mobile group

## Request

    POST /api/v1/mobile/access-reader-groups
##### Body
```JSON5
{
    "name": "namegroup-test", // required, name of group
    "logoType": "house",
    "logoColor" : "#DF3FDF", // optional
    "accessTokenReaderIds":["1631884913599165"] // optional
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1634037550384770",
        "name": "namegroup-test",
        "logoPath": "assets/access-reader-mobile-groups/house.svg",
        "logoColor": "#DF3FDF",
        "createdAt": "2021-10-12T11:19:10.028Z",
        "updatedAt": "2021-10-12T11:19:10.028Z",
        "accessTokenReaders": [
            {
                "id": "1631884913599165",
                "code": "bridge-1",
                "name": "Modbus reader 1",
                "phone": null,
                "stateStatus": "DISCONNECTED",
                "connectionStatus": {
                    "color": "yellow",
                    "title": "Sleeping"
                },
                "enabled": true,
                "isArchived": false,
                "activeAt": "2021-10-11T13:32:46.163Z",
                "createdAt": "2021-09-17T13:21:53.925Z",
                "updatedAt": "2021-09-20T12:10:14.620Z"
            }
        ]
    }
}
```