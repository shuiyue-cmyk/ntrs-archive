const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('JSON PARSE FAIL:', e.message); process.exit(1); }
console.log('JSON parse: OK');
console.log('starts with [:', raw.trim().startsWith('['));
console.log('top-level array:', Array.isArray(j));
console.log('tasks:', j[0].plotTasks.map(t => t.id + ' ' + t.name).join(' | '));

const fields = [];
fields.push(j[0].finalSystemDirective);
for (const t of j[0].plotTasks) {
  fields.push(t.description);
  for (const m of t.promptGroup) fields.push(m.content);
}
const blob = fields.join('\n');

const oldList = {
  'N-A1': '**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**',
  'N-A2': '若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**',
  'N-A3': '- **no_spawn**：本轮无黄毛在场。两种情形：',
  'N-A4': '② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。',
  'N-A6': '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛',
  'N-B1': '**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**',
  'N-B2': '- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开',
  'N-B3': '若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。',
  'N-C1': '判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn；**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act，该行动发生在 {{user}} 场景外）',
  'N-C2': '- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。',
};
console.log('\n--- OLD residual scan ---');
for (const [id, o] of Object.entries(oldList)) {
  console.log(id, 'residual count:', blob.split(o).length - 1);
}

const newList = {
  'N-A1': '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**',
  'N-A2': '以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**',
  'N-A3': '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
  'N-A4': '但若该黄毛已真正锁定且离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，仍可判 act（场景外行动，发生在 {{user}} 场景外）',
  'N-A6': '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛',
  'N-B1': '正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏）',
  'N-B2': '**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**',
  'N-B3': '若该黄毛本轮 act 为场景外行动（黄毛与对象均在 {{user}} 当前场景之外），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排（读者可见，{{user}} 角色不知情），prologue 不展开、黄毛不列入登场名单。',
  'N-C1': '**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）后，在 {{user}} 场景外对目标展开行动——场景外行动照常判 act。**未锁定（背景板）黄毛仍一律 no-act，不适用本条**）',
  'N-C2': '锁定前可 spawn 但不得 act',
};
console.log('\n--- NEW presence scan ---');
for (const [id, n] of Object.entries(newList)) {
  console.log(id, 'present:', blob.includes(n));
}

// spec residual key phrases
const phrases = ['接下来的场景中是否会有黄毛出现的可能', '后续剧情是否有黄毛实际出场的契机', 'prologue 不展开该场景外戏', '本轮无黄毛在场。两种情形'];
console.log('\n--- spec key phrase residual ---');
for (const ph of phrases) console.log(JSON.stringify(ph), '->', blob.split(ph).length - 1);
