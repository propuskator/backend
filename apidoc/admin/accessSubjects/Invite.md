# Invite access subject

## Request
    POST /api/v1/admin/access-subjects/invite/:id

### URL parameters
```
id - access subject id
```

## Response

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1631884982726866",
        "name": "name",
        "fullName": "name (position)",
        "position": "position",
        "email": "email11@email.com",
        "phone": "+380930000000",
        "phoneEnabled": true,
        "avatar": null,
        "avatarColor": "#89D5FF",
        "enabled": true,
        "isArchived": false,
        "isInvited": true,
        "mobileEnabled": true,
        "createdAt": "2021-10-08T17:58:23.646Z",
        "updatedAt": "2021-10-08T17:58:23.646Z",
        "userId": null,
        "registered": true
    }
}
```
