---
name: "玄象"
description: "以数字典藏修复台为视觉隐喻的中国传统认知网络。"
colors:
  light-background: "#f4f0e7"
  light-foreground: "#192522"
  light-card: "#f8f5ed"
  light-card-foreground: "#192522"
  light-primary: "#0c4c4c"
  light-primary-foreground: "#f4f0e7"
  light-secondary: "#e5e4d9"
  light-secondary-foreground: "#263d39"
  light-muted: "#eae7dd"
  light-muted-foreground: "#5d6965"
  light-border: "#cbc9bd"
  light-ring: "#1f6966"
  light-accent: "#a84b3c"
  light-ink: "#0c3336"
  light-ink-foreground: "#eef0e9"
  light-ink-muted: "#b8c9c5"
  light-ink-rule: "#365a5b"
  dark-background: "#111a19"
  dark-foreground: "#ece9df"
  dark-card: "#17211f"
  dark-card-foreground: "#ece9df"
  dark-primary: "#9cc0b9"
  dark-primary-foreground: "#10211f"
  dark-secondary: "#23302d"
  dark-secondary-foreground: "#e1e6df"
  dark-muted: "#1c2825"
  dark-muted-foreground: "#a9b5b0"
  dark-border: "#384440"
  dark-ring: "#8cb4ac"
  dark-accent: "#cf7563"
  dark-ink: "#081311"
  dark-ink-foreground: "#f0eee5"
  dark-ink-muted: "#a9bbb6"
  dark-ink-rule: "#2d4642"
typography:
  display:
    fontFamily: '"Songti SC", "STSong", "Noto Serif CJK SC", serif'
    fontSize: "clamp(5rem, 13vw, 10rem)"
    fontWeight: 500
    lineHeight: 0.82
    letterSpacing: "0.08em"
  headline:
    fontFamily: '"Songti SC", "STSong", "Noto Serif CJK SC", serif'
    fontSize: "clamp(2rem, 4vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"Songti SC", "STSong", "Noto Serif CJK SC", serif'
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 2
  label:
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.16em"
rounded:
  square: "0"
  hairline: "1px"
  sm: "0.25rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.75rem"
  xl: "3rem"
  2xl: "3.5rem"
  section-mobile: "4.5rem"
  section-desktop: "7rem"
components:
  button-primary-light:
    backgroundColor: "{colors.light-primary}"
    textColor: "{colors.light-primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-outline-light:
    backgroundColor: "{colors.light-background}"
    textColor: "{colors.light-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-compact-light:
    backgroundColor: "{colors.light-background}"
    textColor: "{colors.light-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 0.75rem"
    height: "2.25rem"
---

# Design System: 玄象

## Overview

**Creative North Star: “数字典藏修复台”**

玄象不是一组玄学符号，而是一张可研究的中国传统认知网络。视觉系统把暖矿物白纸面、碳墨文字、深青工作台、编目细线、坐标节点、索引表与少量朱砂定位标记组合成“古典未来主义”：有东方知识气质，但以现代信息结构呈现关系、出处和演化。

品牌故事的固定顺序是“品牌与入口 → 思想演化 → 关系图谱 → 知识与推演”。首页首屏以左侧巨幅“玄象”和品牌说明建立识别，右侧用方形关系坐标场直接证明产品是可探索的知识网络；其他页面延续同一材料与信息语法，不机械复制首屏构图。

批准基准为 `.impeccable/mocks/home-option-c-approved.png`，生成 seed 为 `5efd02de`；最终独立评审结论：**APPROVED**。遇到实现与本文件冲突时，以本文件 token 和批准稿的视觉意图共同判定，功能与无障碍约束优先。

**关键特征：**

- 高信息密度但不拥挤，以留白、细线和明确层级组织内容。
- 宋体负责文化与标题，黑体负责操作与说明，等宽数字特性负责年份、坐标和索引。
- 大面积暖矿物白与深青形成明暗工作区，朱砂只标记选择、焦点或关键定位。
- 图谱、索引和关系表是核心信息结构，不以装饰卡片替代。

**品牌原则与内容语气：**学术、清晰、克制；先陈述知识、出处和关系，再呈现术数应用。文案使用“探索、关联、来源、影响、归属、可复核”等研究语言，不夸张、不故作玄虚，不制造权威证据。

## Colors

色彩 token 以 YAML 前言为唯一数值来源；代码中的语义变量（如 `--background`、`--primary`）在明暗主题间映射到对应的 `light-*` 与 `dark-*` token。

### Primary

- **深青主色（`primary`）：**主行动、可操作文本、筛选激活态和知识节点；深色模式提升明度以保持辨识。
- **深墨工作台（`ink`）：**思想演化、图谱预览、页脚等沉浸式信息场，不作为普通卡片底色。

### Secondary

- **灰玉辅助色（`secondary`）：**次级激活态、弱分区和实体类型编码，不与主行动竞争。
- **朱砂标记（`accent`）：**品牌印章、坐标角标、选中关系、微型定位点；同一视口内保持稀少。

### Neutral

- **暖矿物白（`background`）：**全局纸面与主要阅读背景。
- **修复纸面（`card`）：**需要轻微区分的索引行、图谱底板和局部工作面。
- **碳墨（`foreground`）：**正文与高优先级标签。
- **静音墨（`muted-foreground`）：**元数据、出处、坐标、辅助说明；不得承载关键操作唯一信息。
- **编目线（`border`）与深青线（`ink-rule`）：**分栏、表格、时间轴和画布边界。
- **焦点青（`ring`）：**所有键盘焦点，不可被朱砂选中态替代。

**朱砂稀缺规则。** `accent` 只标示品牌印记、选择、焦点关系或重要坐标，不用于大面积背景和连续正文。

**语义网格规则。** 全局背景保持纯净，不铺装饰网格。网格仅出现在图谱、关系坐标、时间/空间刻度等具有数据语义的画布内。

## Typography

**展示字体：**宋体系统栈（`Songti SC` / `STSong` / `Noto Serif CJK SC` / `serif`）  
**正文与界面字体：**中文无衬线系统栈（`PingFang SC` / `Microsoft YaHei` / `Noto Sans CJK SC` / `system-ui`）  
**数字：**沿用界面字体并启用 `tabular-nums`，不额外引入装饰性等宽字体。

### Hierarchy

- **Display：**仅用于品牌首页的“玄象”主标题；大尺度、紧行高、疏字距，不添加 kicker 或装饰字样。
- **Headline：**页面和章节主标题，控制在约 20 个汉字宽以内，允许平衡换行。
- **Title：**条目、时代、典籍和面板标题；以宋体制造文化语境，不靠超粗字重。
- **Body：**16px 基准、宽松行高；长段落建议 60–75 个西文字符或约 30–38 个汉字的可读行长。
- **Label：**12px 左右，用于类型、坐标、模式、索引号；研究标签可采用 0.16em 字距，英文可大写，中文不强制加空格。
- **Metadata：**12–14px、静音色；年份、坐标、编号、数量必须使用等宽数字特性。

**双字体分工规则。** 宋体表达“知识与文化”，无衬线表达“操作与证据”；不要把正文全部宋体化，也不要用书法字体制造古意。

## Layout

页面采用文献工作台式的横向分栏和开放列表。主内容容器最大宽度为 80rem，左右内边距移动端为 1.25rem、桌面端为 2rem；章节上下间距移动端为 4.5rem，`lg` 起为 7rem。页头可放宽到 90rem，固定高度 4.5rem；页脚和窄信息条使用 80rem 容器。

间距优先使用前言中的 8/12/20/28/48/56px 节奏。细线分区后通常留 28px；章节标题至主体通常留 48–56px。页面层级主要依靠留白、1px 边线、背景明度和深墨整段切换，不依靠悬浮卡片。

### 断点与响应式原则

- **基础 / `<640px`：**单列阅读；索引条目语义堆叠；按钮允许换行；图谱保留最小画布并横向滚动，同时提供文字关系表。
- **`sm` / `≥640px`：**局部两列索引、关系表三段式排列，标题可提升字号。
- **`md` / `≥768px`：**可见辅助英文/状态信息；推演入口可进入多列，但不得压缩操作目标。
- **`lg` / `≥1024px`：**启用主分栏、表格式体系索引、图谱检查器侧栏和 7rem 章节节奏。
- **`xl` / `≥1280px`：**显示完整桌面导航；图谱预览与 18rem 说明栏并列。
- 宽表和时间轴优先明确横向滚动，而非缩小字号；移动端应提供“向左滑动”提示或语义堆叠版本。
- 首屏桌面为左文右图约 0.9:1.1；移动端按品牌、说明、行动、坐标场顺序纵向排列。

**边线即结构规则。** 先用边线、对齐和留白建立层级；只有确有信息层级变化时才更换底色。

## Elevation & Depth

系统默认完全扁平，不使用阴影。深度来自暖白与修复纸面的轻微色差、深墨整段背景、1px 编目线和前后层级的留白。页头允许半透明背景与轻微背景模糊，只用于保持滚动时的导航可读性，不扩展为玻璃拟态。

**平面优先规则。** 静止表面没有投影；悬停通过底色、文字色、下划线、节点描边或箭头位移反馈，禁止用抬升阴影制造“卡片感”。

## Shapes

形态以方形、直角和极小圆角为主。按钮与模式切换可使用小圆角，内部分段可收紧到 1px；索引、面板、表格和典籍条目保持方正。1px 细线是默认边界，虚线只表达来源、间接关系或研究层。

图谱用形状承担实体分类：概念为椭圆，典籍为矩形，人物为菱形，学派为切角六边形，术数为双框矩形；形状与文字标签必须同时存在，不能只依赖颜色。关系线通过实线/不同虚线节奏和箭头表达影响、源自、归属、关联与作者等语义。

**无装饰符号规则。** 不使用八卦纹、祥云、金箔、发光法阵、仿古卷轴或无信息含义的圆阵；几何只能承担索引、坐标、关系或状态。

## Components

### Navigation

- 桌面页头是安静的单行轨道：左侧方形朱砂印记与“玄象”，中部/右侧为主导航，最右为研究模式和主题切换。
- 导航文字默认静音，悬停或键盘聚焦时回到正文色，并以 1px 朱砂下划线从右向左展开；当前页需沿用同一语法而非填充胶囊。
- `xl` 以下隐藏完整导航，保留 40px 菜单按钮；展开面板使用两列边线索引，并把研究模式置于导航之前。
- 粘性页头必须保持内容可读，层级高于页面画布，但不得遮挡锚点焦点。

### Buttons

- 主按钮高 44px、水平内边距 20px、小圆角、深青底；用于每个区块的单一主行动。紧凑按钮高 36px、水平内边距 12px。
- 描边按钮使用背景色与编目线，悬停进入 `muted`；幽灵按钮不画常驻边框，只在悬停显示弱底色。
- 文本、边框、图标共同表达状态。禁用态降低不透明度并取消指针事件；焦点统一使用 2px `ring` 外轮廓和 3px 偏移。
- 箭头仅表示进入/继续，悬停最多水平位移 4px；不要让整颗按钮漂浮或缩放。

### Index Lists

- 体系、知识库、典籍和推演入口优先用开放索引、语义表格或分栏列表，不用 bento 卡片墙。
- 桌面表头明确列名；移动端把同一字段按阅读顺序堆叠，不丢失起源、概念、典籍和关联体系。
- 条目以 `C-001`、`B-001` 等等宽编号建立编目感；标题用宋体，出处/朝代/摘要用静音正文。
- 整行可点击时必须有底色或文字色反馈，并保留可见焦点；研究字段只能作为补充，不能替代普通浏览所需的信息。

### Research Mode

- 普通浏览/研究模式是持久的双段切换，使用 `role="group"` 与每段 `aria-pressed`；普通态以碳墨激活，研究态以深青激活。
- 研究模式在同一页面渐进披露出处、时代、人物、典籍和关系，不复制另一套页面，也不突然改变主导航结构。
- 研究面板以虚线顶边、朱砂小标签“研究层 · …”和紧凑元数据标识；隐藏时不留下空白布局。
- 模式选择可持久化，但初始渲染必须有稳定的普通浏览回退，避免闪烁和不可读状态。

### Graph

- 图谱画布必须包含可访问标题/描述、可读节点名、实体类型图例、关系方向和文字关系表；视觉 SVG 不是唯一信息来源。
- 节点可点击，也必须可 Tab 聚焦，并支持 Enter/Space 选择；选择态用朱砂粗描边与外层虚线，相关节点保持完整不透明度，非相关节点仅轻微退让。
- `.graph-node-focus-ring` 是强制无障碍契约：椭圆环 `fill: none`、`stroke: var(--ring)`、`stroke-width: 3`、默认 `opacity: 0`、`pointer-events: none`、`vector-effect: non-scaling-stroke`；在 `.graph-node:focus-visible` 内变为完全可见。不得删除、用浏览器默认 SVG 焦点代替或与选中态混用。
- 图谱背景网格必须对应坐标/尺度；关系边使用箭头和线型编码，选中关系用朱砂加强。边标签必须有可读底板，缩放后描边保持非缩放宽度。
- 小屏画布保持至少 760px 逻辑宽并允许横向滚动；同时显示结果数量、滑动提示和可操作的文字关系表。
- 筛选按钮使用 `aria-pressed`，结果数量放入 `aria-live="polite"`；筛选导致当前节点消失时，应选择首个可见节点或明确显示空状态。

### Interaction, Motion & Accessibility

- 动效只说明关系或状态：导航下划线约 180ms ease-out；颜色与箭头位移使用短促过渡。可选的关系线揭示应缓慢但只运行一次。
- 尊重 `prefers-reduced-motion: reduce`：滚动改为即时，过渡和动画缩至 0.01ms，动画只运行一次。
- 所有按钮、链接、输入和 SVG 节点都要有清晰的 `:focus-visible`；触控目标最小 40×40px，主要按钮为 44px 高。
- 图标若不提供额外信息则标记 `aria-hidden="true"`；纯图标按钮必须有中文 `aria-label`。不要只用颜色表示实体类型、选中、可用性或关系方向。
- 正文、静音文字、边线与交互状态须在明暗主题中分别检查对比度；关键正文不可使用低透明度静音色。

## Do's and Don'ts

### Do

- **Do** 让页面首先回答“这是什么知识、来自哪里、与什么相关”，再提供推演入口。
- **Do** 使用暖白纸面、深青工作区、细线编目和少量朱砂，保持数字典藏修复台的统一世界。
- **Do** 用索引、坐标、关系线、类型形状和文字表格表达真实结构。
- **Do** 为明暗主题、键盘、屏幕阅读器、减少动态效果和小屏横向信息建立等价体验。
- **Do** 将全局背景保持纯净；只在具备坐标或关系语义的图谱/画布内使用网格。

### Don't

- **Don't** 使用“大师”“改命”“测你命运”“今日运势”“免费算命”等预测式或营销式表达。
- **Don't** 伪造古籍原文、学术引文、计算结果或权威背书；解释层不得冒充确定性算法。
- **Don't** 使用金色、渐变、玻璃、发光、厚阴影、仿古纹理、装饰八卦或卡片堆叠来营造“玄学感”。
- **Don't** 把朱砂当品牌主背景，或让每个链接、节点和标签同时高亮。
- **Don't** 为适配移动端而隐藏关键字段、缩小到不可读或取消图谱的文字等价内容。

### Future Page Extension Checklist

- [ ] 页面目的属于“阅读理解”还是“操作研究”，主行动是否唯一且清楚？
- [ ] 信息顺序是否延续“知识/出处 → 关系/演化 → 应用或下一步”？
- [ ] 是否复用了语义色、双字体分工、等宽编号、边线和既有间距，而非新增近似 token？
- [ ] 是否优先采用开放索引、表格、时间轴或关系场，而非卡片墙？
- [ ] 若使用网格，它是否承载坐标、尺度或关系语义，并且局限在画布内部？
- [ ] 研究模式是否渐进披露证据，普通模式是否仍可独立理解？
- [ ] 所有状态是否同时具备文字/形状/线型提示，并完成键盘、焦点、ARIA 与空状态设计？
- [ ] 明暗主题下的正文、静音文字、边线、焦点与朱砂选中态是否均可辨认？
- [ ] 小屏是否保留关键字段，并通过语义堆叠或明确横向滚动处理宽内容？
- [ ] 动效是否服务于状态或关系，并在减少动态效果设置下安全停用？
- [ ] 文案是否学术、清晰、克制，且没有预测营销或未经证实的权威表述？
- [ ] 是否与批准稿 `.impeccable/mocks/home-option-c-approved.png` 和 seed `5efd02de` 的世界观一致？
