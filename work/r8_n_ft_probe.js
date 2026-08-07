// Probe: locate exact OLD strings from spec N-extension in Cirno_NTRS_turn_edit_FT_4.7.json (FT PLAIN)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);

// Build a search blob: all promptGroup content + task descriptions + FSD
const regions = {};
const add = (name, s) => { if (typeof s === 'string' && s.length) regions[name] = s; };
j[0].plotTasks.forEach((t, i) => {
  (t.promptGroup || []).forEach((m, mi) => add(`task${i}[${t.id}]pg${mi}`, m.content));
  add(`task${i}[${t.id}]desc`, t.description);
});
add('FSD', j[0].finalSystemDirective);

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
  'N-C1': `**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。`,
  'N-C2': `- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
};

// Fragments for partial matching (to detect wording drift)
const frags = {
  'N-A1frag': `刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能`,
  'N-A2frag': `出场可能性判定（刷新成功标准，替代纯时空合理性）`,
  'N-A3frag': `本轮无黄毛在场`,
  'N-A4frag': `黄毛表已命中该目标黄毛但本轮在场不合理`,
  'N-A6frag': `本轮判定其在场合理，沿用已有黄毛`,
  'N-B1frag': `prologue 不展开该场景外戏`,
  'N-B2frag': `场景外标注:`,
  'N-B3frag': `若有上一轮已锁定的活跃黄毛则仍按`,
  'N-C1frag': `黄毛行动不依赖本轮是否刷新在场`,
  'N-C2frag': `未真正锁定（背景板/未锁定黄毛天然 no-act）`,
};

for (const [id, old] of Object.entries(olds)) {
  let total = 0;
  const hits = [];
  for (const [rname, s] of Object.entries(regions)) {
    let n = 0, idx = 0;
    while ((idx = s.indexOf(old, idx)) !== -1) { n++; idx += old.length; }
    if (n) { total += n; hits.push(`${rname}x${n}`); }
  }
  console.log(`${id}: exact=${total} ${hits.join(' ')}`);
}
console.log('--- fragments ---');
for (const [id, frag] of Object.entries(frags)) {
  let total = 0;
  const hits = [];
  for (const [rname, s] of Object.entries(regions)) {
    let n = 0, idx = 0;
    while ((idx = s.indexOf(frag, idx)) !== -1) { n++; idx += frag.length; }
    if (n) { total += n; hits.push(`${rname}x${n}`); }
  }
  console.log(`${id}: ${total} ${hits.join(' ')}`);
}
