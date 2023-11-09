# Show current time

## Request
    GET /api/v2/token-reader/time

## Response Body
```
${timestampminutes},${timezone},${timestampseconds}
```
```
timestampminutes - timestamp in minutes
timezone - timezone. Ex. EET-2EEST,M3.5.0/3,M10.4.0/4
timestampseconds - timestamp in seconds
```
## Response Body example
```
26587642;EET-2EEST,M3.5.0/3,M10.4.0/4;1595258527
```