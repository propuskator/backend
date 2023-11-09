# Update access schedule

## Request
    PATCH /api/v1/admin/access-schedules/:id

##### URL parameters
```
id - schedule id
```

##### Body
```JSON5
{
     "name": "schedule122", // required, unique name of schedules
     "enabled" : true, // optional, true/false
     "isArchived" : false, // optional, true/false
     "dates":[
 		{
 			"from" : 1593170173244, // optional, timestamp in milliseconds
 			"to"   : 1593170173245, // optional, timestamp in milliseconds
 			"weekBitMask": [1,1,0,1,1,1,1], // optional, allowed week days mask
 			"monthBitMask": null, // optional, allowed month days mask
 			"dailyIntervalStart" : 60000, // optional, timestamp in milliseconds from start of day
 			"dailyIntervalEnd"   : 12000 // optional, timestamp in milliseconds from start of day
 		}
 	]
 }
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1632138766901313",
        "name": "schedule122",
        "enabled": true,
        "isArchived": false,
        "createdAt": "2021-09-20T11:52:46.824Z",
        "updatedAt": "2021-10-08T17:20:01.422Z",
        "dates": [
            {
                "id": "1633713601693365",
                "scheduleId": "1632138766901313",
                "from": 1593170173244,
                "to": 1593170173245,
                "weekBitMask": [
                    1,
                    1,
                    0,
                    1,
                    1,
                    1,
                    1
                ],
                "monthBitMask": null,
                "dailyIntervalStart": 60000,
                "dailyIntervalEnd": 120000
            }
        ]
    }
}
```