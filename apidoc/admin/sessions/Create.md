# Create jwt tokens

## Request

    POST /api/v1/admin/login

##### Body1
```JSON5
{
    "login": "admin",// required, login
    "password": "admin"// required, password
}
```

##### Body2
```JSON5
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzZWZjNjk2LTc2NTEtNGZlNy1iNDJkLTcyMWZiMmUzZjFlMyIsImxvZ2luIjoiYWRtaW4iLCJhdmF0YXIiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjAtMDYtMThUMTg6MTI6NTIuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjAtMDYtMjZUMTM6NTM6MTkuNDg2WiIsImlhdCI6MTU5MzE3OTcxOCwiZXhwIjoxNTkzMTgxNTE4fQ.VaaXfhx7-_1LzCjc8yGkwOVFvJR4jQF8sR8X71uutWI",// required, login
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzZWZjNjk2LTc2NTEtNGZlNy1iNDJkLTcyMWZiMmUzZjFlMyIsImxvZ2luIjoiYWRtaW4iLCJhdmF0YXIiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjAtMDYtMThUMTg6MTI6NTIuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjAtMDYtMjZUMTM6NTM6MTkuNDg2WiIsImlhdCI6MTU5MzE3OTcxOCwiZXhwIjoxNTkzMTgxNTE4fQ.VaaXfhx7-_1LzCjc8yGkwOVFvJR4jQF8sR8X71uutWI"
    }
}
```