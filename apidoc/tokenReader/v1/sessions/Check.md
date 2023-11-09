# Sessons check
To authirize
- add `X-AuthToken` header with API `token`
- add `X-AuthReader` header with token reader code
http:
- for now still works
https:
- CA-certificate provided on api settings page(*again: its cert that signed the page certificate).
- use this cert to verify the server and protect against man-in-the-middle attacks
