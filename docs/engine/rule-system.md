# RuleSet 与 Policy 系统

`BaziRuleSetRegistry` 是服务器白名单。生产入口默认仅返回 `STABLE` 与 `EXPERIMENTAL`；`TEST_ONLY` 只能在显式测试上下文读取。客户端不能提交代码、表达式或自定义公式。

规则集由年界、月界、日界、时辰、时区、太阳时、十二长生、大运顺逆和起运策略组成。每个 Policy 都有稳定 ID、版本、展示名、说明和实现验证等级。override 通过注册表解析成新的不可变规则对象，并进入 Calculation Fingerprint。

引擎只返回 Policy ID 与 RuleReference 描述，不依赖 Prisma。Citation 映射属于服务/UI 层；没有可靠 Citation 时显示“典据整理中”。

规则差分先比较 Policy，再比较四柱、大运方向、起运与序列。下游影响采用明确领域映射，例如日柱影响日主、时干与十神；月柱影响大运序列。它不是可执行的通用规则脚本系统。
