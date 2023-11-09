# Create access schedule

## Request
    POST /api/v1/admin/access-schedules

##### Body
```JSON5
{
     "name": "schedule122", // required, unique name of schedules
     "enabled" : true, // optional, default: true, true/false
     "isArchived" : false, // optional, default: true, true/false
     "dates":[ 
 		{   // required, object must be not empty
 			"from" : 1593170173244, // optional, timestamp in milliseconds
 			"to"   : 1593170173245, // optional, timestamp in milliseconds
 			"weekBitMask": [1,1,1,1,1,1,1], // required, allowed week days mask
 			"monthBitMask": null, // optional, allowed month days mask
 			"dailyIntervalStart" : 60000, // required, timestamp in milliseconds from start of day
 			"dailyIntervalEnd"   : 120000 // required, timestamp in milliseconds from start of day
 		}
 	]
 }
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "id": "1633712130913519",
        "name": "schedule122",
        "enabled": true,
        "isArchived": false,
        "createdAt": "2021-10-08T16:55:30.199Z",
        "updatedAt": "2021-10-08T16:55:30.199Z",
        "dates": [
            {
                "id": "5",
                "scheduleId": "1633712130913519",
                "from": 1593170173244,
                "to": 1593170173245,
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
                "dailyIntervalStart": 60000,
                "dailyIntervalEnd": 120000
            }
        ]
    }
}
```