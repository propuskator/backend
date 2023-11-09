# Get list of access token readers

## Request
    GET /api/v1/mobile/access-token-readers

## Response

```JSON5
{
    "status": 1,
    "data": [
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
            "updatedAt": "2021-09-20T12:10:14.620Z",
            "displayedTopics": []
        },
        {
            "id": "1631884913550004",
            "code": "bridge-2",
            "name": "Modbus reader 2",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "yellow",
                "title": "Sleeping"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-10-11T13:12:09.349Z",
            "createdAt": "2021-09-17T13:21:53.925Z",
            "updatedAt": "2021-09-20T10:55:10.262Z",
            "displayedTopics": []
        },
        {
            "id": "1631884913703779",
            "code": "bridge-3",
            "name": "Modbus reader 3",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "red",
                "title": "Inactive"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-10-05T17:01:11.616Z",
            "createdAt": "2021-09-17T13:21:53.925Z",
            "updatedAt": "2021-09-20T10:55:14.132Z",
            "displayedTopics": []
        },
        {
            "id": "1631884913692464",
            "code": "bridge-4",
            "name": "Modbus reader 4",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "red",
                "title": "Inactive"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-10-05T17:01:13.205Z",
            "createdAt": "2021-09-17T13:21:53.925Z",
            "updatedAt": "2021-09-20T10:54:51.403Z",
            "displayedTopics": []
        },
        {
            "id": "1631884913350155",
            "code": "bridge-5",
            "name": "Modbus reader 5",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "red",
                "title": "Inactive"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-09-20T13:55:14.755Z",
            "createdAt": "2021-09-17T13:21:53.925Z",
            "updatedAt": "2021-09-20T10:55:17.647Z",
            "displayedTopics": []
        }
    ]
}
```
