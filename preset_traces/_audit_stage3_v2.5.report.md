# Stage3 (defaultPlotTask) v2.5 Audit Report

审计对象：6 个 v2.5 预设文件的 Stage3 (defaultPlotTask) ——快速通道规则落地 + split-m0 拆分 + 结构完整性 + 残留矛盾。
数据源：`_audit_stage3_v2.5.txt`（dump，3911 行；本审计只读 dump，未改任何预设）。

---

## 一、逐文件结果

### 1. straight_2.5 (Cirno_NTRS_turn_edit_straight_2.5.json)

**1.1 快速通道规则**
- [OK] 规则位于 `msg[0]` (role=system, len=1695, dump L38-83)，紧跟角色身份与 NSFW 免责之后、上游注入之前——属 SYSTEM 早期指令，AI 会读为最高优先级指令。
- [OK] 触发条件正确：「当上游 `<thugSpawn>` 内容为 no_spawn 且 `<thugAction>` 为 no-act 时」——同时要求 no_spawn AND no-act，符合设计。
- [OK] 省略项完整：stage/cast/plot 整块省略、花火观剧感言省略、不输出 `<ntrsProgress>` 标签——四项全列。
- [OK] 一行文名案符合预期：prologue = 「本轮无黄毛登场，主线按 {{user}} 输入推进」；Log = 「no_spawn + no-act，快速通道输出」。
- [OK] 收尾声明「此规则仅为节省等待时间……下一轮若有 spawn 或 act，恢复完整导演分析」——状态非持久。
- 首 ~150 字原文 (L42-48)：「**【快速通道——no_spawn + no-act 时跳过导演分析】** 当上游 `<thugSpawn>` 内容为 no_spawn 且 `<thugAction>` 为 no-act 时（即本轮无黄毛登场、无黄毛出手），跳过全部导演分析、合理性审核、cast/plot 批评、sparkNotes 思考，直接输出最简 `<content>`：- prologue：仅一行「本轮无黄毛登场，主线按 {{user}} 输入推进」- stage / cast / plot：整块省略 - 花火观剧感言：省略 - 不输出 `<ntrsProgress>` 标签（无黄毛锁定）」
- [OK] `msg[1]` (assistant prefill, L85) 同步呼应快速通道：「no_spawn+no-act 就走快速通道，有 spawn 就继续编排」。

**1.2 split-m0 结果**
- [OK] `promptGroup count = 19`（dump L36；原 17，新增 2 条 SYSTEM）。
- 拆分布局：原单一大 m0 拆为 `msg[0]`（system, 1695 字：身份/NSFW 免责/快速通道/上游注入 `{{thugSpawn}}/{{thugSpawnReason}}/{{thugAction}}/{{thugActionReason}}/{{recall}}/$8`）+ `msg[2]`（system, 8798 字：NTRS XP 驱动声明→淫妻线定义→身体接受度门槛表→敏感角色→【你的职责】）。其余 15 条原序号顺延 +2（原 m1→现 m3，依此类推）。
- msg 映射（现 msg[i] → 原 17 版）：
  - msg[0] system 身份+快速通道+上游注入
  - msg[1] assistant prefill 快速通道呼应
  - msg[2] system 大块定义（原 m0 后半）
  - msg[3] USER 「下面是输出格式模板」(原 m1)
  - msg[4] assistant 「呵呵~看模板」(原 m2)
  - msg[5] USER prologue 模板 (原 m3)
  - msg[6] assistant (原 m4)
  - msg[7] USER stage 模板 (原 m5)
  - msg[8] assistant (原 m6)
  - msg[9] USER cast/plot 模板 (原 m7)
  - msg[10] assistant (原 m8)
  - msg[11] USER 核心约束 (原 m9)
  - msg[12] assistant (原 m10)
  - msg[13] USER 背景设定注入 (原 m11)
  - msg[14] assistant (原 m12)
  - msg[15] USER 历史记录+上游标签 (原 m13)
  - msg[16] assistant (原 m14)
  - msg[17] USER 重要提醒+自检+sparkNotes (原 m15)
  - msg[18] assistant prefill「呵呵~让我理理这出戏的脉络」(原 m16)

**1.3 结构完整性**
- [OK] `defaultPlotTask.stage = 3` `order = 2` `extractTags = prologue,plot` `minLength = 500` `maxRetries = 10` `dependsOn = plotTaskThugTempo,plotTask2` `enabled = true`（dump L31、L34-35）。
- [OK] FSD (L8-25, len=127) 含 `$8`/`{{recall}}`/`{{thugSpawn}}`/`{{thugAction}}`/`{{prologue}}`/`{{plot}}`——六个占位符全到。无 dangling。
- [OBSERVATION] 本文件 plotTaskThugTempo.extractTags 仅 `thugSpawn,thugAction`（L30），未产出 userCalib，故 FSD 不含 `{{userCalib}}` 与之自洽；不构成悬空。此为 straight（非 revise）变体设计：用户输入走 `$8` 原值不经校准。非 BUG。

**1.4 残留矛盾**
- [BUG] 快速通道 vs `msg[17]` 自检清单矛盾。`msg[17]` (L540+) 含「**【零、登场角色完整分析 - 最高优先级（必须）】** 0. {{user}} 永久入名单（必须）…必须出现在 prologue 登场角色名单、cast 分析、plot 批评三处中」「2. 全员覆盖：cast 和 plot 必须分析登场名单中的每一个角色」「每轮输出 <content> 前，必须自问以下七题，任一不达标则回头修正」「sparkNotes 思考…<content> 紧接在 </sparkNotes> 后」——这些"必须/每轮/不得省略"硬约束在快速通道场景下与 m0「整块省略 stage/cast/plot、跳过 sparkNotes」直接冲突，且 m17 位于对话末尾、标"最高优先级"，易被 AI 解读为后置硬约束覆盖前置快速通道豁免，导致 no_spawn+no-act 时仍输出完整结构而失效快速通道。建议：在 m0 快速通道块末尾追加「本规则优先于 m17 登场角色完整分析与七题自检；触发快速通道时跳过 m17 自检直接输出」；或在 m17 顶部加一前置条件「若已触发快速通道（no_spawn + no-act），本节全部跳过」。
- [OBSERVATION] 快速通道规定 prologue 仅一行，但 `msg[5]` prologue 模板含「本幕概要/登场角色/机缘暗流/幕后事件」多节强制结构；触发快速通道时 AI 同时被 m0「仅一行」与 m5「必须含这些节」拉扯。同上需显式豁免。
- [OK] 快速通道规定「不输出 `<ntrsProgress>` 标签」，与 `msg[9]` plot 模板 + `msg[17]` 自检第 8 条「无已锁定时不输出该标签」一致，不冲突。

### 2. straight_revise_2.5 (Cirno_NTRS_turn_edit_straight_revise_2.5.json)

**2.1 快速通道**：[OK] `msg[0]` (system, len=1753, L684-729) 含同款规则，触发条件 / 省略项 / 一行文 / 收尾声明一字不差（见下文跨文件比对）。msg[1] prefill 呼应一致。

**2.2 split-m0**：[OK] `count=19`（L682）。msg[0]=1753 字（比 straight 多 58 字——见 2.3 userCalib 注入）；msg[2] system 维持 9011 字，NTRS XP 驱动声明起头一致。msg 映射同上 1.2。

**2.3 结构完整性**
- [OK] stage=3/order=2/extractTags=prologue,plot/minLength=500/dependsOn/enabled 一致（L677-682）。
- [OK] 本变体 plotTaskThugTempo.extractTags = `thugSpawn,thugAction,userCalib`（L676）——含 userCalib；故本文件 FSD 用 `{{userCalib}}` 取代 `$8`（L656），并新增 `【输入校准】` 块在 m0 注入 `{{userCalib}}`（L715-716）——这是 straight_revise 比 straight 多出的 58 字内容。配套一致，无悬空。
- [OK] FSD 仍含 `{{recall}}{{thugSpawn}}{{thugAction}}{{prologue}}{{plot}}`——五大 relay 到位；`{{userCalib}}` 出现在 FSD 顶部 `<User_Input>` 内——已注入。无 dangling。

**2.4 残留矛盾**：[BUG] 同 1.4——m17 自检硬约束与快速通道豁免未显式协调，存在后置覆盖风险。

### 3. FT_2.5 (Cirno_NTRS_turn_edit_FT_2.5.json)

**3.1 快速通道**：[OK] `msg[0]` (system, len=1695, L1335-1380) 规则原文与 straight_2.5 完全一致。msg[1] 呼应。

**3.2 split-m0**：[OK] `count=19`（L1333）。msg[0] 1695 字与 straight 等长；msg[2] 9282 字（略长于 straight 的 8798，FT 变体定义差异）。msg 映射一致。

**3.3 结构**：[OK] stage=3/order=2/extractTags=prologue,plot/dependsOn=plotTaskThugTempo,plotTask2/enabled=true（L1331）。FSD (L1305-1322) = `$8` + 五 relay，无 userCalib，与 plotTaskThugTempo.extractTags=thugSpawn,thugAction（无 userCalib，L1326）一致。无悬空。

**3.4 残留**：[BUG] 同 1.4 m17 覆盖矛盾。

### 4. FT_revise_2.5 (Cirno_NTRS_turn_edit_FT_revise_2.5.json)

**4.1 快速通道**：[OK] `msg[0]` (system, len=1753, L1986-2031) 一字不差。msg[1] 呼应。

**4.2 split-m0**：[OK] `count=19`（L1984）。msg[0] 1753 字（同 straight_revise，含 userCalib 注入）；msg[2] 9495 字（FT 变体最长）。映射一致。

**4.3 结构**：[OK] stage/extractTags/dependsOn 一致（L1982）。plotTaskThugTempo.extractTags = `thugSpawn,thugAction,userCalib`（L1976）→ FSD 用 `{{userCalib}}`（L1957）取 `$8` 位，注入 `【输入校准】` 块，配套无悬空。

**4.4 残留**：[BUG] 同 1.4。

### 5. DEI_2.5 (Cirno_NTRS_turn_edit_DEI_2.5.json)

**5.1 快速通道**：[OK] `msg[0]` (system, len=1695, L2642-2687) 一字不差。msg[1] 呼应。

**5.2 split-m0**：[OK] `count=19`（L2640）。msg[0] 1695（无 userCalib）；msg[2] 9343 字。映射一致。

**5.3 结构**：[OK] stage/extractTags/dependsOn 一致（L2638）。FSD = `$8` + 五 relay，plotTaskThugTempo.extractTags = `thugSpawn,thugAction`（无 userCalib），一致无悬空。

**5.4 残留**：[BUG] 同 1.4。

### 6. DEI_revise_2.5 (Cirno_NTRS_turn_edit_DEI_revise_2.5.json)

**6.1 快速通道**：[OK] `msg[0]` (system, len=1753, L3293-3338) 一字不差。msg[1] 呼应。

**6.2 split-m0**：[OK] `count=19`（L3291）。msg[0] 1753（含 userCalib 注入）；msg[2] 9556 字（DEI 变体最长）。映射一致。

**6.3 结构**：[OK] stage/extractTags/dependsOn 一致（L3289）。plotTaskThugTempo.extractTags = `thugSpawn,thugAction,userCalib`（L3283）→ FSD 用 `{{userCalib}}`（L3264），无悬空。

**6.4 残留**：[BUG] 同 1.4。

---

## 二、跨文件汇总

### 2.1 快速通道规则——逐字一致性
[OK] 全 6 文件的快速通道块（位于各自 msg[0]，helper L42-49 / L688-695 / L1339-1346 / L1990-1997 / L2646-2653 / L3297-3304）逐字相同，包括：
- 标题「**【快速通道——no_spawn + no-act 时跳过导演分析】**」
- 触发「当上游 `<thugSpawn>` 内容为 no_spawn 且 `<thugAction>` 为 no-act 时（即本轮无黄毛登场、无黄毛出手）」—— AND 条件明确
- 跳过项「跳过全部导演分析、合理性审核、cast/plot 批评、sparkNotes 思考」
- 最简 content 五要素：prologue 一行 / stage-cast-plot 整块省略 / 花火观剧感言省略 / 不输出 `<ntrsProgress>` 标签 / Log 一行
- 一行文「本轮无黄毛登场，主线按 {{user}} 输入推进」与「no_spawn + no-act，快速通道输出」全 6 文件统一
- 收尾「此规则仅为节省等待时间，不影响后续任何轮次——下一轮若有 spawn 或 act，恢复完整导演分析」全 6 文件统一
- 无任何文件出现用词偏移或条件弱化（如漏写"且"、改"或"等）。
[OK] 全 6 文件的 msg[1] assistant prefill 均含「no_spawn+no-act 就走快速通道，有 spawn 就继续编排」呼应。

### 2.2 split-m0 结构
[OK] 全 6 文件 promptGroup count 均为 **19**（无文件偏离）。无 BUG。
- 全 6 文件拆分点一致：m0 = 身份+NSFW 免责+快速通道+上游注入（非revise用 `$8`，revise用 `{{userCalib}}`+【输入校准】块）；m1 = assistant 快速通道呼应 prefill；m2 = 原大 SYSTEM（XP 驱动声明→淫妻线定义→【你的职责】），m2 首行均为「淫妻线终局由 {{user}} 自身 NTRS 癖好驱向乐享型——但推波助澜以「黄毛已登场」为起点」（helper L89/L735/L1386/L2037/L2693/L3344）——拆分切口无差异。
- m0 长度两类：无 userCalib 变体（straight/FT/DEI）= 1695 字符；带 userCalib 变体（straight_revise/FT_revise/DEI_revise）= 1753 字符（多 58 字 = 【输入校准】块）。同类内长度一致——变体内自洽。
- 全 6 文件原 17 版的 m1-m16 均顺延 +2 → 现 m3-m18，序号映射无错位。

### 2.3 结构完整性
[OK] 全 6 文件：`defaultPlotTask.stage = 3`，`order = 2`，`extractTags = prologue,plot`（六字一段，全一致），`minLength = 500`，`dependsOnTaskIds = [plotTaskThugTempo, plotTask2]`，`enabled = true`。无文件出现 stage 编号错乱或 extractTags 漂移。

[OK] FSD 占位符合预期（5 大 relay 全到位）：全 6 文件 FSD 均含 `{{recall}}` / `{{thugSpawn}}` / `{{thugAction}}` / `{{prologue}}` / `{{plot}}`。

[OBSERVATION] FSD 的 `{{userCalib}}` 分流（设计非 bug）：
- 3 个非 revise 文件（straight / FT / DEI）：FSD `<User_Input>` 用 `$8` 原始用户输入，plotTaskThugTempo.extractTags = `thugSpawn,thugAction`（不含 userCalib）。FSD 不出现 `{{userCalib}}`——与上游不产 userCalib 一致，无悬空。
- 3 个 revise 文件（*_revise）：FSD `<User_Input>` 用 `{{userCalib}}`，plotTaskThugTempo.extractTags = `thugSpawn,thugAction,userCalib`（含 userCalib）。FSD 出现 `{{userCalib}}`——与上游产出一致，无悬空。
- 非 revise 与 revise 是两种校准分流设计；各自内部三文件一致，无 dangling placeholder。
- 唯一需用户确认项：你给出的 FSD 期望清单含 `{{userCalib}}`——该期望仅匹配 revise 变体；非 revise 变体有意不用 userCalib 走 `$8`。若希望 6 文件 FSD 全含 `{{userCalib}}`，则非 revise 三文件需把 plotTaskThugTempo 第三步重引入——属设计决策非当前 bug。

### 2.4 残留矛盾（关键 BUG，全 6 文件同患）

**[BUG] 快速通道豁免 vs `msg[17]` 自检硬约束未显式协调，后置覆盖风险**

全 6 文件的 `msg[17]`（即原 17 版 m15，顺延后的「重要提醒 + 七题自检 + sparkNotes」USER 块）含一组与快速通道豁免直接冲突的"必须/每轮/不得省略"硬表述：

1. 「**【零、登场角色完整分析 - 最高优先级（必须）】**」
2. 「0. {{user}} 永久入名单（必须）……必须出现在 prologue 登场角色名单、cast 分析、plot 批评三处中」
3. 「2. 全员覆盖：cast 和 plot 必须分析登场名单中的每一个角色」
4. 「每轮输出 <content> 前，必须自问以下七题，任一不达标则回头修正」
5. 「思考以……开始，用 <sparkNotes></sparkNotes> 标签包裹思考过程，<content> 紧接在 </sparkNotes> 后」
6. 「**NTR 进度结算（写 <stage> 前必须先填完，禁止留空）**」

快速通道豁免要求 no_spawn + no-act 时：跳过 sparkNotes、省略 stage/cast/plot、prologue 仅一行。m17 既标"最高优先级（必须）"又要求"每轮"必走七题自检 + sparkNotes 思考——AI 在末位 USER 指令强势压下，很可能无视 m0 快速通道豁免仍输出完整结构，使快速通道形同虚设。

触发概率：no_spawn + no-act 恰是早期无黄毛轮的常态路径（无敏感角色 / 已锁定但本轮留白），触发频次高，故此矛盾影响面大。

**修复建议（二选一）**：
- (A) m0 快速通道块末尾追加一句：「本规则优先级高于 m17 登场角色完整分析与七题自检；触发快速通道时直接输出最简 content，跳过 m17 自检与 sparkNotes。」
- (B) m17 顶部加前置条件：「⚠️ 若已触发 m0 快速通道（no_spawn + no-act），本节登场角色分析与七题自检一律跳过，直接按 m0 快速通道输出。」

推荐 (B)，m0 已是该规则发起处，m17 加前置条件使末位硬约束自我让位，结构最干净。

**[OBSERVATION] 快速通道场景下 prologue 模板冲突**：`msg[5]` prologue 模板含「本幕概要/登场角色/机缘暗流/幕后事件」多节强制结构 + 「prologue 全文禁止出现推进/淫妻线/NTR 系统内部术语」——触发快速通道时 prologue 仅一行「本轮无黄毛登场，主线按 {{user}} 输入推进」并不符合该模板的多节结构。同 2.4 修复即可一并豁免。属 m17 修复的副作用同治，不单列 bug。

**[OK] 快速通道规则位置**：全 6 文件均位于 `msg[0]` (system)——属 SYSTEM 早期指令，AI 实际会读为强约束。它没有错放进 USER task_rules 块中段（如 m7/m9/m11 等位置），落地位置合理。split-m0 后仍稳定在 m0，未在拆分中迁移错位。

---

## 三、总结

| 检查项 | 结论 |
|---|---|
| 快速通道规则存在性与位置 | [OK] 全 6 文件均在 msg[0] (system)，未在 split 中迁移 |
| 快速通道跨文件逐字一致 | [OK] 触发/省略/一文/收尾全等，无文件偏离 |
| split-m0 promptGroup count | [OK] 全 6 文件 = 19，无偏离 |
| split-m0 拆分点一致性 | [OK] 全 6 文件 m0=身份+快速通道+上游注入，m2=大块定义，切口同位 |
| defaultPlotTask 元数据 | [OK] 全 6 文件 stage=3/order=2/extractTags=prologue,plot/dependsOn=plotTaskThugTempo,plotTask2/enabled=true 一致 |
| FSD 五大 relay | [OK] recall/thugSpawn/thugAction/prologue/plot 全 6 文件到位 |
| FSD userCalib 分流 | [OBSERVATION] revise 三文件用 {{userCalib}} 配 userCalib tag；非 revise 三文件用 $8 配无 userCalib tag——各自自洽，非 dangling，属设计分流 |
| 快速通道 vs m17 自检矛盾 | **[BUG]** 全 6 文件同患——m17 末位硬约束"必须/每轮/不得省略 sparkNotes"与 m0 豁免未协调，后置覆盖风险，需在 m0 或 m17 加显式让位句 |
| 快速通道 vs m5 prologue 模板 | [OBSERVATION] m5 多节强制结构在快速通道场景下与"prologue 仅一行"冲突，随 m17 修复一并豁免 |

**唯一需修 BUG**：m0 快速通道豁免与 m17 自检硬约束的优先级未显式声明。修复点单一（在 m0 块尾或 m17 头加一句优先级让位），影响 6 个文件同一处。其余项全 [OK] 或 [OBSERVATION]。

---

*报告生成于只读审计；未修改任何预设文件。dump 数据无缺失，未回源 JSON 取二次原文。*
