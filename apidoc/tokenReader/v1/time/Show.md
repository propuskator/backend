# Show current time

## Request
    GET /api/v1/token-reader/time

## Response Body
```
${timestampminutes},${timezonehoursoffset},${timestampseconds}
```
```
timestampminutes - timestamp in minutes
timezonehoursoffset - timezone offset in hours
timestampseconds - timestamp in seconds
```
## Response Body example
```
26587642,3,1595258527
```