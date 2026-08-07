// R8 NTRS extension fix for Cirno_NTRS_turn_edit_FT_4.7.json (FT PLAIN: 2-step S2, no userCalib, not ALLin)
// Applies N-A1, N-A2, N-A3, N-A4, N-A6(opt), N-B1, N-B2, N-B3, N-C1, N-C2
// N-A5 is ALLin-only -> not applicable to this variant.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
if (!Array.isArray(j) || !raw.trim().startsWith('[')) throw new Error('top-level not array');

// [id, OLD, NEW] — OLD byte-for-byte from spec N-extension (plain variant wording)
const pairs = [
  ['N-A1', `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`,
   `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`],
  ['N-A2', `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
   `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`],
  ['N-A3', `- **no_spawn**：本轮无黄毛在场。两种情形：`,
   `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['N-A4', `② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。`,
   `② 分支A——黄毛表已命中该目标黄毛但黄毛不在 {{user}} 当前场景画面内（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场、同楼其他房间等），输出 no_spawn——但若该黄毛已真正锁定且离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，仍可判 act（场景外行动，发生在 {{user}} 场景外）；行动判定为 no-act 时下游 stage3 走快速通道。`],
  ['N-A6', `② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛`,
   `② 分支A——黄毛表已命中该目标黄毛，本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛`],
  ['N-B1', `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`,
   `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**`],
  ['N-B2', `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
   `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**`],
  ['N-B3', ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。`,
   ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已真正锁定的活跃黄毛，且其本轮 act 行动发生在 {{user}} 当前场景内，则按"真正锁定"规则登场编排；若该黄毛本轮 act 为场景外行动（黄毛与对象均在 {{user}} 当前场景之外），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。`],
  ['N-C1', `**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。`,
   `**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act。**未锁定（背景板）黄毛仍一律 no-act，不适用本条**。`],
  ['N-C2', `- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
   `- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act，锁定前可 spawn 但不得 act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手（含目标与 {{user}} 同场且黄毛无合理制造离场契机的手段）。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`],
];

// Collect all string regions to walk
const regions = [];
j[0].plotTasks.forEach((t, i) => {
  (t.promptGroup || []).forEach((m, mi) => regions.push({ ref: `task${i}[${t.id}]pg${mi}`, get: () => m.content, set: v => { m.content = v; } }));
  regions.push({ ref: `task${i}[${t.id}]desc`, get: () => t.description, set: v => { t.description = v; } });
});
regions.push({ ref: 'FSD', get: () => j[0].finalSystemDirective, set: v => { j[0].finalSystemDirective = v; } });

const results = [];
for (const [id, old, neu] of pairs) {
  let total = 0;
  const hits = [];
  for (const r of regions) {
    const s = r.get();
    if (typeof s !== 'string') continue;
    let n = 0, idx = 0;
    while ((idx = s.indexOf(old, idx)) !== -1) { n++; idx += old.length; }
    if (n) {
      r.set(s.split(old).join(neu));
      total += n;
      hits.push(`${r.ref}x${n}`);
    }
  }
  results.push({ id, total, hits });
  console.log(`${id}: hit=${total} ${hits.join(' ')}`);
}

// Verify: re-parse, residual OLD scan, NEW present
const out = JSON.stringify(j, null, 2);
const check = JSON.parse(out);
if (!Array.isArray(check)) throw new Error('post-write parse not array');
if (!out.trim().startsWith('[')) throw new Error('post-write first char not [');

// Verify on the parsed content blob (avoids JSON.stringify quote-escaping false negatives)
const blob = regions.map(r => r.get()).join('\n---\n');
const residual = [];
const missingNew = [];
const newCounts = {};
for (const [id, old, neu] of pairs) {
  const oc = blob.split(old).length - 1;
  // N-C1 NEW starts with its OLD by design -> expect exactly 1 occurrence (inside NEW)
  if (id === 'N-C1') { if (oc !== 1) residual.push(`${id}(oldCount=${oc},expect1)`); }
  else if (oc > 0) residual.push(`${id}(oldCount=${oc})`);
  const nc = blob.split(neu).length - 1;
  newCounts[id] = nc;
  if (nc < 1) missingNew.push(id);
}

// Spec residual phrases (absent from all NEW texts)
const specPhrases = [
  '接下来的场景中是否会有黄毛出现的可能',
  '后续剧情是否有黄毛实际出场的契机',
  '若接下来的场景中黄毛有合理出场路径',
  'prologue 不展开该场景外戏',
  '本轮无黄毛在场。两种情形',
  '若有上一轮已锁定的活跃黄毛则仍按',
  '本轮在场不合理（如目标不在场',
  '本轮判定其在场合理，沿用已有黄毛',
];
const phraseResidual = [];
for (const ph of specPhrases) {
  const n = blob.split(ph).length - 1;
  if (n > 0) phraseResidual.push(`${ph} x${n}`);
}
console.log('residual OLD:', residual.length ? residual.join(',') : 'none');
console.log('residual spec phrases:', phraseResidual.length ? phraseResidual.join(' ; ') : 'none');
console.log('missing NEW:', missingNew.length ? missingNew.join(',') : 'none');
console.log('NEW counts:', JSON.stringify(newCounts));

if (!residual.length && !missingNew.length && !phraseResidual.length) {
  fs.writeFileSync(path, out, 'utf8');
  console.log('WRITTEN ok, bytes:', out.length);
} else {
  console.log('NOT WRITTEN (residual/missing)');
  process.exit(1);
}
