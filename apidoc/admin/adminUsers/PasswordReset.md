# Reset admin's password

## Request
    POST /api/v1/admin/passwordReset

## Request
```JSON5
{
    "token": "token  from email",
    "password" : "12345678",
    "passwordConfirm" : "12345678"
}
```

## Response

```JSON5
{
    "status": 1,
    "meta": {
        "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjExMjMwNDEyMTAyNTczIiwiaWF0IjoxNjExMjQzNjA1fQ.TIHVIaPv75I5jKiwcaBP3xOlhUnrUZxKptU1vVVbMBU"
    }
}
```