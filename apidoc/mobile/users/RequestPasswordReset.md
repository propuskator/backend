# Request email with code to reset password

## Request
    POST /api/v1/mobile/requestPasswordReset

## Request
```JSON5
{
    "workspace": "qwe",
    "email": "email@email.com"
}
```

## Response

```JSON5
{
    "status": 1,
    "data": {
        "passwordResetTokentoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjMzOTYxMTYzNzY5NjI0IiwiaWF0IjoxNjMzOTYyODA4fQ.IX10XPR1NkODwhGaEcNB4hASv_uEHeWJ_KqwP-aFiE8"
    }
}
```