# Get list of access token readers

## Request
    GET /api/v1/admin/access-token-readers

##### GET parameters
```
ids - optional, list of ids to filter
search - optional
enabled - optional, true/false
isArchived - optional, true/false
stateStatus - optional, DISCONNECTED/ACTIVE/INACTIVE
connectionStatus - optional, Active, Sleeping, Init, Connection problem, Inactive
updateStart - optional, date
updateEnd - optional, date
createStart - optional, date
createEnd - optional, date
accessReadersGroupIds - optional, accessReadersGroup ids
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: createdAt, id/name/enabled/createdAt/updatedAt/popularityCoef/code
order - optional, default: DESC, ASC/DESC
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633865346690059",
            "code": "code123",
            "name": "name123",
            "phone": "+380682643916",
            "stateStatus": "INACTIVE",
            "connectionStatus": {
                "color": "yellow",
                "title": "Init"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": null,
            "createdAt": "2021-10-10T11:29:06.466Z",
            "updatedAt": "2021-10-10T11:29:06.459Z",
            "accessReadersGroups": [
                {
                    "id": "1633865289879327",
                    "name": "namegroup121",
                    "enabled": true,
                    "isArchived": false,
                    "color": "#FDE149",
                    "createdAt": "2021-10-10T11:28:09.361Z",
                    "updatedAt": "2021-10-10T11:28:09.361Z"
                }
            ],
            "hasUpdates": false,
            "displayedTopics": []
        },
        {
            "id": "1632821465961291",
            "code": "bridge-6",
            "name": "[bridge] Modbus reader 6",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "red",
                "title": "Inactive"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-09-28T13:33:15.181Z",
            "createdAt": "2021-09-28T09:31:05.105Z",
            "updatedAt": "2021-09-28T09:31:05.100Z",
            "accessReadersGroups": [],
            "hasUpdates": false,
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
            "accessReadersGroups": [],
            "hasUpdates": true,
            "displayedTopics": []
        },
        {
            "id": "1631884913550004",
            "code": "bridge-2",
            "name": "Modbus reader 2",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "red",
                "title": "Inactive"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-10-05T17:01:08.413Z",
            "createdAt": "2021-09-17T13:21:53.925Z",
            "updatedAt": "2021-09-20T10:55:10.262Z",
            "accessReadersGroups": [],
            "hasUpdates": true,
            "displayedTopics": []
        },
        {
            "id": "1631884913599165",
            "code": "bridge-1",
            "name": "Modbus reader 1",
            "phone": null,
            "stateStatus": "DISCONNECTED",
            "connectionStatus": {
                "color": "red",
                "title": "Inactive"
            },
            "enabled": true,
            "isArchived": false,
            "activeAt": "2021-10-05T17:01:05.186Z",
            "createdAt": "2021-09-17T13:21:53.925Z",
            "updatedAt": "2021-09-20T12:10:14.620Z",
            "accessReadersGroups": [],
            "hasUpdates": true,
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
            "accessReadersGroups": [],
            "hasUpdates": true,
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
            "accessReadersGroups": [],
            "hasUpdates": true,
            "displayedTopics": []
        }
    ],
    "meta": {
        "filteredCount": 7,
        "total": 7
    }
}
```