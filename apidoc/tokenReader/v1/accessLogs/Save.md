# Post logs

## Request

    POST /api/v1/token-reader/access-logs

#### Request Body
```
${timestampseconds1}_${code1}_${state1},${timestampseconds2}_${code2}_${state2},...,${timestampsecondsn}_${coden}_${staten}
```
```
timestampseconds* - timestamps in seconds
code* - access subbject token codes
state* - access state, 1 - allowed, 0 - denied
```

There is special case, when reader send code "btn-exit", it means that the reader was opened using physical exit button
```
${timestampseconds}_btn-exit_${state}
```
#### Request Body example
```
1597925395_3DFCDFCF_1,1597925396_3DFCDFCF_0
```

## Request Body
```
ok
```
