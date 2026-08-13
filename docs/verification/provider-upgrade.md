# 历法 provider 升级流程

`lunar-typescript` 已锁定为 1.8.6。升级前必须运行 `pnpm calendar:verify-terms`、`pnpm test`，保存 fixture 差异；任何四柱变化都要先判断是 provider 改动、fixture 来源修订还是引擎错误，并记录到 `docs/engine/bazi-changelog.md`。不得直接修改 expected 使测试变绿。
# Provider Upgrade Gate

任何 calendar provider 版本变化都必须运行 `pnpm bazi:verify-foundation`、`pnpm test`，并比较机器可读 `BAZI_REGRESSION_MANIFEST`。Calendar、Four Pillar 或 Luck fixture 任一输出变化均不得静默接受；必须人工分类为算法修复、Provider 差异或规则变化，并按影响更新版本和 changelog。
