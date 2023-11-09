# Get list of access subject tokens

## Request
    GET /api/v1/admin/access-subject-tokens

##### GET parameters
```
ids - optional, list of ids to filter
search - optional
accessSubjectId - optional, accessSubject id
enabled - optional, true/false
isArchived - optional, true/false
updateStart - optional, date
updateEnd - optional, date
createStart - optional, date
createEnd - optional, date
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: createdAt, createdAt/updatedAt/code/enabled/isArchived/id
order - optional, default: DESC, ASC/DESC
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633863929838634",
            "accessSubjectId": "1631885019231767",
            "name": "code3",
            "code": "CODE3",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": "2021-10-10T11:05:29.050Z",
            "createdAt": "2021-10-10T11:05:29.050Z",
            "updatedAt": "2021-10-10T11:05:29.050Z"
        },
        {
            "id": "1633863593545527",
            "accessSubjectId": null,
            "name": "name 2",
            "code": "CODE2",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": null,
            "createdAt": "2021-10-10T10:59:53.476Z",
            "updatedAt": "2021-10-10T10:59:53.476Z"
        },
        {
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
        },
        {
            "id": "1632141396828662",
            "accessSubjectId": null,
            "name": "C11AFB",
            "code": "C11AFB",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": null,
            "createdAt": "2021-09-20T12:36:36.554Z",
            "updatedAt": "2021-09-20T12:36:36.554Z"
        },
        {
            "id": "1631884930944655",
            "accessSubjectId": null,
            "name": "49437C",
            "code": "49437C",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": "2021-10-08T18:51:09.448Z",
            "createdAt": "2021-09-17T13:22:10.064Z",
            "updatedAt": "2021-09-17T13:22:10.064Z"
        },
        {
            "id": "1631884925698545",
            "accessSubjectId": "1633718086122431",
            "name": "3F00B9",
            "code": "3F00B9",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": "2021-10-08T18:21:48.659Z",
            "createdAt": "2021-09-17T13:22:05.702Z",
            "updatedAt": "2021-09-17T13:22:05.702Z"
        },
        {
            "id": "1631884923827104",
            "accessSubjectId": "1631885006293998",
            "name": "B15077",
            "code": "B15077",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": null,
            "createdAt": "2021-09-17T13:22:03.067Z",
            "updatedAt": "2021-09-17T13:22:03.067Z"
        }
    ],
    "meta": {
        "filteredCount": 7,
        "total": 7
    }
}
```