# Show access reader group


## Request

    GET /api/v1/admin/access-reader-groups/:id
##### URL parameters
```
id - group id
```

## Response

```JSON5
{
    "status": 1,
    "data": {
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
    }
}
```