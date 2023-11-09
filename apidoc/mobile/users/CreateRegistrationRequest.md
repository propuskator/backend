# Creates request for user registration by admin

## Request
    POST /api/v1/mobile/createRegistrationRequest

## Body
```json
{
    "workspace": "qwe",
    "subjectName": "test",
    "email": "test@test.com",
    "phone": "+380000000000",
    "password": "fake-password",
    "passwordConfirm": "fake-password"
}
```

## Response
```json
{
    "status": 1
}
```