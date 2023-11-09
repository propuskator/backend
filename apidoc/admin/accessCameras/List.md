# Get list of access cameras

## Request
    GET /api/v1/admin/access-cameras

##### GET parameters
```
ids - optional, list of ids to filter
search - optional
updateStart - optional, date
updateEnd - optional, date
createStart - optional, date
enabled - optional, boolean
status - optional, string: ready/disconnected/init
createEnd - optional, date
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: createdAt, createdAt/updatedAt
order - optional, default: DESC, ASC/DESC
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633945949983809",
            "name": "name",
            "enabled": true,
            "isArchived": false,
            "wssStreamUrl": "wss://localhost/streamming-service/1633945949983809",
            "createdAt": "2021-10-11T09:52:29.960Z",
            "lastSuccessStreamAt": null,
            "lastAttemptAt": "2021-10-11T09:56:13.041Z",
            "updatedAt": "2021-10-11T09:52:29.960Z",
            "accessTokenReaders": [
                {
                    "id": "1633865346690059",
                    "code": "code1234",
                    "name": "name1234",
                    "phone": "+380682643915",
                    "stateStatus": "INACTIVE",
                    "connectionStatus": {
                        "color": "yellow",
                        "title": "Init"
                    },
                    "enabled": true,
                    "isArchived": false,
                    "activeAt": null,
                    "createdAt": "2021-10-10T11:29:06.466Z",
                    "updatedAt": "2021-10-10T11:54:29.743Z"
                }
            ],
            "poster": "node-static/access-cameras/frames/c0c8df4c4499022aea291aec24e688d6ec66b2319cd2da0ab4f6e3ccc6329464.jpg",
            "status": "disconnected"
        }
    ],
    "meta": {
        "filteredCount": 1,
        "total": 1
    }
}
```
