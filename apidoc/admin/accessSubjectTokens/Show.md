# Show access subject token


## Request
    GET /api/v1/admin/access-subject-tokens/:id

##### URL parameters
```
id - subject token id
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1633863593284421",
        "accessSubjectId": null,
        "name": "name 1",
        "code": "CODE1",
        "type": null,
        "enabled": true,
        "isArchived": false,
        "assignedAt": null,
        "createdAt": "2021-10-10T10:59:53.468Z",
        "updatedAt": "2021-10-10T10:59:53.468Z"
    }
}
```