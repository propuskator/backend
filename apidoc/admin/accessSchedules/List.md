# Get list of access schedules

## Request
    GET /api/v1/admin/access-schedules

##### GET parameters
```
ids - optional, list of ids to filter
search - optional
limit - optional, default: 20, limit
offset - optional, default: 0, offset
sortedBy - optional, default: createdAt, createdAt/updatedAt/enabled/name/popularityCoef
order - optional, default: DESC, ASC/DESC
enabled - optional, true/false
isArchived - optional, true/false
updateStart - optional, date
updateEnd - optional, date
createStart - optional, date
createEnd - optional, date
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
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
        },
        {
            "id": "1631884872483178",
            "name": "Weekends",
            "enabled": true,
            "isArchived": false,
            "createdAt": "2021-09-17T13:21:12.306Z",
            "updatedAt": "2021-09-17T13:21:12.306Z",
            "dates": [
                {
                    "id": "3",
                    "scheduleId": "1631884872483178",
                    "from": null,
                    "to": null,
                    "weekBitMask": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        1
                    ],
                    "monthBitMask": null,
                    "dailyIntervalStart": 0,
                    "dailyIntervalEnd": 86340000
                }
            ]
        },
        {
            "id": "1631884872107639",
            "name": "Working hours",
            "enabled": true,
            "isArchived": false,
            "createdAt": "2021-09-17T13:21:12.301Z",
            "updatedAt": "2021-09-17T13:21:12.301Z",
            "dates": [
                {
                    "id": "2",
                    "scheduleId": "1631884872107639",
                    "from": null,
                    "to": null,
                    "weekBitMask": [
                        1,
                        1,
                        1,
                        1,
                        1,
                        0,
                        0
                    ],
                    "monthBitMask": null,
                    "dailyIntervalStart": 28800000,
                    "dailyIntervalEnd": 72000000
                }
            ]
        },
        {
            "id": "1631884872595317",
            "name": "Full access",
            "enabled": true,
            "isArchived": false,
            "createdAt": "2021-09-17T13:21:12.297Z",
            "updatedAt": "2021-09-17T13:21:12.297Z",
            "dates": [
                {
                    "id": "1",
                    "scheduleId": "1631884872595317",
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
                    "dailyIntervalStart": 0,
                    "dailyIntervalEnd": 86340000
                }
            ]
        }
    ],
    "meta": {
        "filteredCount": 4,
        "total": 4
    }
}
```