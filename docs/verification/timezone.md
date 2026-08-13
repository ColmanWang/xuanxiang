# 时区与 DST 验证

输入使用 IANA timezone，由 Temporal 解析历史 offset，不以当前 UTC offset 回推。公历表示采用 ISO 8601 的 proleptic Gregorian 规则，支持范围 1900—2100。

专项覆盖 America/New_York、Europe/London、Australia/Sydney 的春季不存在时间与秋季重复时间，并抽查 Asia/Shanghai、Asia/Hong_Kong、America/New_York、Europe/London 的 20 世纪 offset。重复时刻不默认 earlier/later；API 返回 `AMBIGUOUS_LOCAL_TIME`，用户必须明确选择。

1900 年代早期时区记录来自 IANA 历史数据，精度和现代法定时间不可等同；Trace 标记为 `HISTORICAL_TIMEZONE`。
