# Get list of accesssubject tokens

## Request
    GET /api/v1/mobile/access-subject-tokens

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1631884930944655",
            "accessSubjectId": "1631884982726866",
            "name": "49437C",
            "code": "49437C",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": "2021-10-12T10:33:34.015Z",
            "createdAt": "2021-09-17T13:22:10.064Z",
            "updatedAt": "2021-09-17T13:22:10.064Z"
        },
        {
            "id": "1632141396828662",
            "accessSubjectId": "1631884982726866",
            "name": "C11AFB",
            "code": "C11AFB",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": "2021-10-12T10:33:34.015Z",
            "createdAt": "2021-09-20T12:36:36.554Z",
            "updatedAt": "2021-09-20T12:36:36.554Z"
        },
        {
            "id": "1633863593545527",
            "accessSubjectId": "1631884982726866",
            "name": "name 2",
            "code": "CODE2",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": "2021-10-12T10:33:34.015Z",
            "createdAt": "2021-10-10T10:59:53.476Z",
            "updatedAt": "2021-10-10T10:59:53.476Z"
        }
    ]
}
```