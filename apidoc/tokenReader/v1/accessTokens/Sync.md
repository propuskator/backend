# Sync rules

## Request

    POST /api/v1/token-reader/access-tokens/sync

#### Request Body
```
${timestampminutes}%${code1},...,${coden}
```
```
timestampminutes* - timestamps in minutes, get changes from this date
code* - access subbject token codes, get changes only for this codes
```

#### Request Body example(empty body)
```
323213312%
```

#### Request Body example(only date)
```
323213312
```

#### Request Body example(only tokens)
```
%code1,code2
```

#### Request Body example(date + tokens)
```
323213312%code1,code2
```

## Response Body
```
${timestampminutes}%${code_to_delete_1},...,${code_to_delete_n}%
${code}_/${rule_code}_${rule_data}
${code}_/${rule_code}_${rule_data}
${code}_/${rule_code}_${rule_data}
${code}_/${rule_code}_${rule_data}
```
```
timestampminutes - last update at
code_to_delete_* - codes to delete
code - access subject token code
${rule_code}_${rule_data} - rule
```
#### Rules
##### RULE1, from, to
```
/1_${from_timestamp_in_minutes}_${to_timestamp_in_minutes}
```
- `from_timestamp_in_minutes` - timestamp in minutes
- `to_timestamp_in_minutes` - timestamp in minutes
###### Example
```
/1_26553028_26553088
```
##### RULE3, week mask
```
3_${from_day_time_in_minutes}_${to_day_time_in_minutes}_${week_mask}
```
- `from_day_time_in_minutes` - timestamp in minutes from beginning of a day
- `to_day_time_in_minutes` - timestamp in minutes from beginning of a day
- `week_mask` - week mask, monday, tuesday,..., sunday. see example
###### Example
```
/3_36000_78200_1110101
```
##### RULE7, from, to, week mask
```
7_${from_day_time_in_minutes}_${to_day_time_in_minutes}_${week_mask}_${from_timestamp_in_minutes}_${to_timestamp_in_minutes}
```
- `from_day_time_in_minutes` - timestamp in minutes from beginning of a day
- `to_day_time_in_minutes` - timestamp in minutes from beginning of a day
- `week_mask` - week mask, monday, tuesday,..., sunday. see example
- `from_timestamp_in_minutes` - timestamp in minutes
- `to_timestamp_in_minutes` - timestamp in minutes
###### Example
```
/7_36000_78200_1110101_26553028_26553088
```