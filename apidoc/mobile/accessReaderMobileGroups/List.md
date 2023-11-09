# Get list of access reader mobile groups

## Request
    GET /api/v1/mobile/access-reader-groups
    
##### GET parameters
```
search - optional
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: id, createdAt/updatedAt/name/id
order - optional, default: DESC, ASC/DESC
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1634037550384770",
            "name": "namegroup-test",
            "logoPath": "assets/access-reader-mobile-groups/house.svg",
            "logoColor": "#DF3FDF",
            "createdAt": "2021-10-12T11:19:10.028Z",
            "updatedAt": "2021-10-12T11:19:10.028Z"
        }
    ],
    "meta": {
        "filteredCount": 1,
        "total": 1
    }
}
```