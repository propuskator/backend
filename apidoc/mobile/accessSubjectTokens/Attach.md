# Attach access subject token

## Request
    POST /api/v1/mobile/access-subject-tokens/attach/id

##### Body
```JSON5
{
    "id": "234124124"
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1631884930944655",
        "accessSubjectId": "1631884982726866",
        "name": "49437C",
        "code": "49437C",
        "type": null,
        "enabled": true,
        "isArchived": false,
        "assignedAt": "2021-10-12T10:36:20.024Z",
        "createdAt": "2021-09-17T13:22:10.064Z",
        "updatedAt": "2021-09-17T13:22:10.064Z"
    }
}
```