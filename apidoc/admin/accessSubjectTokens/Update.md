# Update access subject token

## Request
    PATCH /api/v1/admin/access-subject-tokens/:id

##### URL parameters
```
id - subject token id
```

##### Body
```JSON5
{
    "name": "code 1",// optional, name
    "code":"GT5CD1",// optional, unique code
	"type":"RFID",// optional, NFC/RFID
    "enabled": true,// optional, default: true, true/false
    "isArchived":false,// optional, default: false, true/false
    "accessSubjectId": "1631885019231767"// optional, accessSubject id
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1633863593284421",
        "accessSubjectId": "1631885019231767",
        "name": "code 1",
        "code": "GT5CD1",
        "type": null,
        "enabled": true,
        "isArchived": false,
        "assignedAt": "2021-10-10T11:20:52.120Z",
        "createdAt": "2021-10-10T10:59:53.468Z",
        "updatedAt": "2021-10-10T11:20:52.120Z"
    }
}
```