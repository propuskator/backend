# Create access subject token

## Request
    POST /api/v1/admin/access-subject-tokens

        code            : [ 'required', 'string', 'trim', { 'max_length': 255 } ],
    //  type            : [ 'required', 'string', 'trim', { 'one_of': [ AccessSubjectToken.TYPE_NFC, AccessSubjectToken.TYPE_RFID ] } ],
        enabled         : [ 'boolean', { 'default': true } ],
        isArchived      : [ 'boolean', { 'default': false } ],
        accessSubjectId : [ 'uuid' ]
##### Body
```JSON5
{
    "name": "code1", // required, name
    "code": "CODE1", // required, unique code only '^[A-Z0-9]+$'
    "type":"NFC", // not used, NFC/RFID
    "enabled": true, // optional, default: true, true/false
    "isArchived":false, // optional, default: false, true/false
    "accessSubjectId": "1631885019231767" // optional, accessSubject id
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1633863988640834",
        "accessSubjectId": "1631885019231767",
        "name": "code1",
        "code": "CODE1",
        "type": null,
        "enabled": true,
        "isArchived": false,
        "assignedAt": "2021-10-10T11:06:28.772Z",
        "createdAt": "2021-10-10T11:06:28.772Z",
        "updatedAt": "2021-10-10T11:06:28.772Z"
    }
}
```