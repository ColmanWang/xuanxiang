# 四柱全链路验证

固定 40 条四柱 fixture，覆盖 UTC、Asia/Shanghai、Asia/Hong_Kong、Asia/Tokyo、America/New_York、America/Los_Angeles、Europe/London、Australia/Sydney。Tier A 使用香港天文台节气/公农历公开表并结合独立日柱公式；Tier B 使用独立 JD 公式、IANA 时区不变量与 adapter 交叉路径；Tier C 只允许作回归，不宣称外部验证。

此外运行五虎遁 10×12、五鼠遁 10×12、十神 10×10 穷举，以及 1000 个 1900—2100 随机公历输入的 invariant 测试。测试证明实现闭合与无非法干支组合，不证明传统理论本身。
