// Independent post-fix verification: re-read file from disk
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('JSON PARSE FAIL:', e.message); process.exit(1); }
console.log('JSON valid: true');
console.log('top-level array:', Array.isArray(j), '| first char:', raw.trim()[0]);

const p = j[0];
console.log('name:', p.name);
console.log('plotTasks:', p.plotTasks.length, '| ids:', p.plotTasks.map(t => t.id).join(','));
console.log('FSD len:', (p.finalSystemDirective || '').length);

const blob = [];
p.plotTasks.forEach((t, i) => {
  (t.promptGroup || []).forEach(m => blob.push(m.content || ''));
  blob.push(t.description || '');
});
blob.push(p.finalSystemDirective || '');
const all = blob.join('\n---\n');

// OLD residual (exact from spec)
const olds = {
  'N-A1': `**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**`,
  'N-A2': `3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：
 - 必须从角色卡、世界书、背景设定、当前剧情线、后续场景趋势中查证：**接下来的场景中该黄毛是否有实际出现的可能**（有出场契机/进入画面的路径/与目标互动的机会）？
 - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）
 - 若接下来的场景中黄毛有合理出场路径（目标将去公共场所、黄毛可被引荐/偶遇/主动接近、后续互动有展开空间）→ 判 **spawn**`,
  'N-A3': `- **no_spawn**：本轮无黄毛在场。两种情形：`,
  'N-A4': `② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。`,
  'N-A6': `② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛`,
  'N-B1': `**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**`,
  'N-B2': `- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开`,
  'N-B3': ` - thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛；若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。`,
  'N-C2': `- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
};
// N-C1: OLD is prefix of NEW -> count must be exactly 1
const oldC1 = `**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。`;

let bad = 0;
for (const [id, old] of Object.entries(olds)) {
  const n = all.split(old).length - 1;
  if (n > 0) { console.log(`RESIDUAL ${id}: ${n}`); bad++; }
}
const c1 = all.split(oldC1).length - 1;
console.log('N-C1 old-prefix count (expect 1, inside NEW):', c1);
if (c1 !== 1) { bad++; }

// NEW presence
const news = {
  'N-A1': `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  'N-A2': `以 **{{user}} 本轮当前场景画面** 为唯一基准`,
  'N-A3': `本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）`,
  'N-A4': `② 分支A——黄毛表已命中该目标黄毛但黄毛不在 {{user}} 当前场景画面内（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场、同楼其他房间等）`,
  'N-A6': `本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛`,
  'N-B1': `正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌，{{user}} 角色不知情，属 📹 事后知情或 🌙 完全不知的暗线戏），prologue 不把该戏作为 {{user}} 在场戏展开`,
  'N-B2': `**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**`,
  'N-B3': `且其本轮 act 行动发生在 {{user}} 当前场景内，则按"真正锁定"规则登场编排`,
  'N-C1': `**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**：黄毛虽不在 {{user}} 当前场景画面内（no_spawn），但可主动制造目标离开 {{user}} 场景的机会（约定/诱引/传递信息/外部事件引走目标等合理手段）`,
  'N-C2': `未真正锁定（背景板/未锁定黄毛天然 no-act，锁定前可 spawn 但不得 act）`,
};
for (const [id, neu] of Object.entries(news)) {
  const n = all.split(neu).length - 1;
  console.log(`NEW ${id}: ${n}`);
  if (n < 1) bad++;
}

// {[db.*]} blocks untouched check + single-brace {user} leak check
const dbBlocksBefore = (() => { const b = fs.readFileSync(path, 'utf8'); return (b.match(/\[\{db\.[^}]*\}\]/g) || []).length; })();
console.log('{[db.*]} blocks found (should be untouched):', dbBlocksBefore);
const singleUser = all.match(/(?<!\{)user(?!\})/g);
console.log('single-brace user leaks:', singleUser ? singleUser.length : 0);

console.log(bad === 0 ? 'VERIFY: ALL PASS' : `VERIFY: ${bad} FAILURES`);
process.exit(bad === 0 ? 0 : 1);
