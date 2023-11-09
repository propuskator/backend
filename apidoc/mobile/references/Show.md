# Show notification type

## Request
    GET /api/v1/admin/references/:name

##### GET parameters

```JSON5
{
    "status": 1,
    "notification_types": [
        {
            "name": "USER_ACTIONS",
            "label": {
                "ru": "Действия пользователей мобильного приложения",
                "en": "User actions in the mobile application",
                "uk": "Дії користувачів у мобільному додатку"
            }
        },
        {
            "name": "READER_STATE",
            "label": {
                "ru": "Состояние точек доступа",
                "en": "Access point status",
                "uk": "Стан точок доступу"
            }
        },
        {
            "name": "ACCESS_ATTEMPTS",
            "label": {
                "ru": "Попытки несанкционированного доступа",
                "en": "Unauthorized access attempts",
                "uk": "Спроби несанкціонованого доступу"
            }
        }
    ],
    "access_cameras_statuses": [
        "init",
        "disconnected",
        "ready"
    ],
    "reported_issues_types": [
        "web_app",
        "mobile_app"
    ],
    "reported_issues_statuses": [
        "pending",
        "sending",
        "sent"
    ],
    "reported_admin_issues_types": [
        "web_app"
    ],
    "reported_user_issues_types": [
        "mobile_app"
    ]
}
```