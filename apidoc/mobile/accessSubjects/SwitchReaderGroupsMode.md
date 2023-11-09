# show or hide readers groups

## Request
    PATCH /api/v1/mobile/access-subject/reader-groups/:id

##### URL parameters
```
id - subject id
```

##### Body
```JSON5
{
   "showReaderGroups" : "true" //boolean, required
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "showReaderGroups": true
    }
}
```