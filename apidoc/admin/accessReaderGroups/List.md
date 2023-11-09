# Get list of access reader groups

## Request

    GET /api/v1/admin/access-reader-groups
##### GET parameters
```
ids - optional, list of ids to filter
search - optional
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: id, popularityCoef/name/id
order - optional, default: DESC, ASC/DESC
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633869138594126",
            "name": "namegroup121",
            "enabled": true,
            "isArchived": false,
            "color": "#9E60EF",
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
            "createdAt": "2021-10-10T12:32:18.611Z",
            "updatedAt": "2021-10-10T12:32:18.611Z"
        },
        {
            "id": "1633865289879327",
            "name": "namegroup121",
            "enabled": true,
            "isArchived": false,
            "color": "#FDE149",
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
            "createdAt": "2021-10-10T11:28:09.361Z",
            "updatedAt": "2021-10-10T11:28:09.361Z"
        }
    ],
    "meta": {
        "filteredCount": 2,
        "total": 2
    }
}
```