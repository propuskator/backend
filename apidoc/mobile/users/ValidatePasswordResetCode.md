# Validate reset-password-code against reset-password-token

## Request
    POST /api/v1/mobile/validatePasswordResetCode

## Request
```JSON5
{
    "token": "token from RequestPasswordReset response",
    "code": "6-digit code from email"
}
```

## Response

```JSON5
{
    "status": 1
}
```