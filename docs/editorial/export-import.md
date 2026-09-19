# 内容导出与导入

```bash
pnpm content:export --out /tmp/xuanxiang-content.json
pnpm content:import --file /tmp/xuanxiang-content.json --dry-run
pnpm content:import --file /tmp/xuanxiang-content.json --apply
```

导出稳定排序且排除无意义时间差异；Manifest 记录 schema version、计数和 checksum。导入默认 dry-run，先计划与校验；只有 `--apply` 才在单一事务内写入，失败则整体回滚。
