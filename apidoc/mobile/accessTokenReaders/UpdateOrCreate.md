# Create or update access token reader

## Request
    PUT /api/v1/mobile/access-token-readers

##### Body
accessTokenReaderId : [ 'required', 'positive_integer' ],
customName          : [ 'not_empty' ]

```JSON5
{
    "accessTokenReaderId": 1631884913599165,
    "customName": "bridge-1"
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "accessTokenReaderId": 1631884913599165,
        "customName": "bridge-1"
    }
}
```