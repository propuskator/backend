# Show access schedule


## Request

    GET /api/v1/admin/access-schedules/:id
##### URL parameters
```
id - schedule id
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1632138766901313",
        "name": "all",
        "enabled": true,
        "isArchived": false,
        "createdAt": "2021-09-20T11:52:46.824Z",
        "updatedAt": "2021-09-20T11:52:46.824Z",
        "dates": [
            {
                "id": "4",
                "scheduleId": "1632138766901313",
                "from": null,
                "to": null,
                "weekBitMask": [
                    1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    1
                ],
                "monthBitMask": null,
                "dailyIntervalStart": 3600000,
                "dailyIntervalEnd": 82740000
            }
        ]
    }
}
```