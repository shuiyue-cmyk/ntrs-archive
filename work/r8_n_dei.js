// R8 NTRS extension - DEI plain (Cirno_NTRS_turn_edit_DEI_4.7.json)
// Applies N-A1..N-A6 + N-B1..N-B3 + N-C1..N-C2 from fix_spec_r8.md N-extension.
const fs = require('fs');

const jsonPath = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_4.7.json';

const raw = fs.readFileSync(jsonPath, 'utf8');
const j = JSON.parse(raw); // keep ORIGINAL top-level j (array); do NOT unwrap
const p = j[0];

const pairs = [
  // ---- N-A1 ----
  [
    '**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**',
    '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**',
  ],
  // ---- N-A2 (multiline, plain 1-space indent) ----
  [
    `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
    '3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。',
  ],
  // ---- N-A3 ----
  [
    '- **no_spawn**：本轮无黄毛在场。两种情形：',
    '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
  ],
  // ---- N-A4 ----
  [
    '② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。',
    '② 分支A——黄毛表已命中该目标黄毛但黄毛不在 {{user}} 当前场景画面内（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场、同楼其他房间等），输出 no_spawn——但若该黄毛已真正锁定且离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，仍可判 act（场景外行动，发生在 {{user}} 场景外）；行动判定为 no-act 时下游 stage3 走快速通道。',
  ],
  // ---- N-A6 (optional) ----
  [
    '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛',
    '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛',
  ],
  // ---- N-B1 ----
  [
    '**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**',
    '**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略，或黄毛制造对象离场契机后场景外接触），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开**',
  ],
  // ---- N-B2 ----
  [
    '- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开',
    '- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略（或制造对象离场契机后场景外接触）时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**',
  ],
  // ---- N-B3 ----
  [
    ' - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。',
    ' - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已真正锁定的活跃黄毛，且其本轮 act 行动发生在 {{user}} 当前场景内，则按"真正锁定"规则登场编排；若该黄毛本轮 act 为场景外行动（黄毛与对象均在 {{user}} 当前场景之外），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。',
  ],
  // ---- N-C1 ----
  [
    '**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。',
    '**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act。**未锁定（背景板）黄毛仍一律 no-act，不适用本条**。',
  ],
  // ---- N-C2 (optional) ----
  [
    '- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。',
    '- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act，锁定前可 spawn 但不得 act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手（含目标与 {{user}} 同场且黄毛无合理制造离场契机的手段）。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。',
  ],
];

const ids = ['N-A1', 'N-A2', 'N-A3', 'N-A4', 'N-A6', 'N-B1', 'N-B2', 'N-B3', 'N-C1', 'N-C2'];
console.log('pairs:', pairs.length, 'ids:', ids.length);

const tasks = p.plotTasks || [];
function collect() {
  const out = [];
  for (const t of tasks) {
    if (typeof t.description === 'string') out.push(t.description);
    for (const m of (t.promptGroup || [])) if (typeof m.content === 'string') out.push(m.content);
  }
  if (typeof p.finalSystemDirective === 'string') out.push(p.finalSystemDirective);
  return out;
}

// ---- pass 1: count hits before any replacement ----
{
  const strs = collect();
  console.log('\n==== PRE-REPLACEMENT HIT COUNTS ====');
  pairs.forEach(([old, _new], i) => {
    let n = 0;
    for (const s of strs) n += s.split(old).length - 1;
    console.log(`${n}\t${ids[i]}`);
  });
}

// ---- pass 2: apply replacements in memory over each string ----
const fields = [];
for (const t of tasks) {
  if (typeof t.description === 'string') fields.push({ obj: t, key: 'description' });
  for (const m of (t.promptGroup || [])) if (typeof m.content === 'string') fields.push({ obj: m, key: 'content' });
}
fields.push({ obj: p, key: 'finalSystemDirective' });

for (const f of fields) {
  for (const [old, nw] of pairs) {
    f.obj[f.key] = f.obj[f.key].split(old).join(nw);
  }
}

// ---- pass 3: verify NEW present, OLD gone ----
const newStrs = collect();
console.log('\n==== POST-REPLACEMENT: OLD residual / NEW presence ====');
let allOk = true;
pairs.forEach(([old, nw], i) => {
  let oldN = 0, newN = 0;
  for (const s of newStrs) { oldN += s.split(old).length - 1; newN += s.split(nw).length - 1; }
  const ok = oldN === 0 && newN > 0;
  if (!ok) allOk = false;
  console.log(`${ids[i]}: oldResidual=${oldN} newCount=${newN} ${ok ? 'OK' : 'FAIL'}`);
});

// ---- write back ----
const outRaw = JSON.stringify(j, null, 2);
let parsedOk = true, topArray = false;
try {
  const check = JSON.parse(outRaw);
  topArray = Array.isArray(check);
} catch (e) {
  parsedOk = false;
  console.log('JSON.parse of output FAILED:', e.message);
}

if (parsedOk && topArray) {
  fs.writeFileSync(jsonPath, outRaw, 'utf8');
  console.log('\nWROTE file. bytes:', Buffer.byteLength(outRaw, 'utf8'));
} else {
  console.log('\nNOT written (parseOk=' + parsedOk + ' topArray=' + topArray + ')');
}

// ---- final verify: re-read from disk ----
const re = fs.readFileSync(jsonPath, 'utf8');
console.log('\n==== DISK VERIFY ====');
console.log('re-read starts with [ :', re.trimStart().startsWith('['));
let reJ = null, reOk = false;
try { reJ = JSON.parse(re); reOk = true; } catch (e) { console.log('re-read parse FAIL:', e.message); }
console.log('re-read JSON.parse:', reOk, '| top-level array:', reOk && Array.isArray(reJ));

if (reOk && Array.isArray(reJ)) {
  const rp = reJ[0];
  const rstrs = [];
  for (const t of (rp.plotTasks || [])) {
    if (typeof t.description === 'string') rstrs.push(t.description);
    for (const m of (t.promptGroup || [])) if (typeof m.content === 'string') rstrs.push(m.content);
  }
  if (typeof rp.finalSystemDirective === 'string') rstrs.push(rp.finalSystemDirective);
  const blob = rstrs.join('\n@@@\n');
  console.log('final old-residual check:',
    ['接下来的场景中是否会有黄毛出现的可能', '后续剧情是否有黄毛实际出场的契机', 'prologue 不展开该场景外戏', '本轮无黄毛在场。两种情形', '黄毛仅是"存在"'].map(k => `${k} => ${blob.split(k).length - 1}`).join(' | '));
  console.log('final new-present check:',
    ['本轮黄毛能否进入 {{user}} 当前场景画面', '正文 content 完整编排该场景外戏', '读者可见全貌', '目标与 {{user}} 同处当前场景时（黄毛已真正锁定）', '锁定前可 spawn 但不得 act'].map(k => `${k} => ${blob.split(k).length - 1}`).join(' | '));
}
