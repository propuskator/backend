# Update access token reader

## Request
    PATCH /api/v1/admin/access-token-readers/:id

##### URL parameters
```
id - token reader id
```

##### Body
```JSON5
{
    "name": "name123",// optional, unique token reader name
    "code": "code123",// optional, unique token reader code
    "enabled": true,//optional, default: true, true/false
    "phone": "+380682643916",
    "isArchived": false,//optional, default: false, true/false
    "accessReadersGroupIds":["1633865289879327"]
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
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
        "updatedAt": "2021-10-10T11:54:29.743Z",
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
        ]
    }
}
```