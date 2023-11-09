# Bulk Create access subject tokens

## Request
    POST /api/v1/admin/access-subject-tokens/bulk-create

    data : [
                'required',
                {
                    'list_of_objects' : [ {
                        name : [ 'required', 'string', 'trim', 'not_empty', { 'fixed_max_length': 255 }, { 'fixed_min_length': 1 } ],
                        code : [ 'required', 'string', 'trim', 'not_empty', { 'fixed_max_length': 255 }, { 'fixed_min_length': 1 },
                            { 'custom_error_code': [ 'WRONG_ACCESS_SUBJECT_TOKEN_CODE_FORMAT', 'like', '^[A-Z0-9]+$' ] } ]
                    } ]
                }
            ]
##### Body
```JSON5
{
	"data": [
		{
			"name" : "name 1",
			"code" : "CODE1"  // required, unique code, only '^[A-Z0-9]+$'
		},
		{
			"name" : "name 2",
			"code" : "CODE2"  // required, unique code, only '^[A-Z0-9]+$'
		}
	]
}
```

## Response

```JSON5
{
    "status": 1,
    "data": [
        {
            "id": "1633863593284421",
            "accessSubjectId": null,
            "name": "name 1",
            "code": "CODE1",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": null,
            "createdAt": "2021-10-10T10:59:53.468Z",
            "updatedAt": "2021-10-10T10:59:53.468Z"
        },
        {
            "id": "1633863593545527",
            "accessSubjectId": null,
            "name": "name 2",
            "code": "CODE2",
            "type": null,
            "enabled": true,
            "isArchived": false,
            "assignedAt": null,
            "createdAt": "2021-10-10T10:59:53.476Z",
            "updatedAt": "2021-10-10T10:59:53.476Z"
        }
    ],
    "meta": {
        "updatedQuant": 0,
        "createdQuant": 2
    }
}
```