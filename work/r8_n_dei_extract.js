// R8 NTRS extension - DEI plain: dump readable text + probe OLD patterns
const fs = require('fs');
const path = require('path');

const jsonPath = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_4.7.json';
const dumpPath = 'C:/Users/zouyu/Downloads/BATTLE_work/review_dump/Cirno_NTRS_turn_edit_DEI_4.7.txt';

const raw = fs.readFileSync(jsonPath, 'utf8');
console.log('raw starts with [ :', raw.trimStart().startsWith('['));
const j = JSON.parse(raw);
const p = j[0];
console.log('top-level array len:', j.length);
console.log('preset name:', p.name);

const lines = [];
lines.push('==== PRESET NAME ====');
lines.push(p.name);
lines.push('');

lines.push('==== FINAL SYSTEM DIRECTIVE ====');
lines.push(p.finalSystemDirective || '(none)');
lines.push('');

const tasks = p.plotTasks || [];
console.log('plotTasks count:', tasks.length);
for (const t of tasks) {
  lines.push(`==== TASK id=${t.id} name=${t.name} stage=${t.stage} order=${t.order} ====`);
  if (t.description) { lines.push(`-- description --`); lines.push(t.description); }
  const pg = t.promptGroup || [];
  pg.forEach((m, i) => {
    lines.push(`-- msg[${i}] role=${m.role} len=${(m.content || '').length} --`);
    lines.push(m.content || '');
    lines.push('');
  });
}

fs.writeFileSync(dumpPath, lines.join('\n'), 'utf8');
console.log('dump written:', dumpPath, 'bytes:', fs.statSync(dumpPath).size);

// ---- probe OLD patterns from spec (N-extension), count occurrences across all fields ----
function countAll(needle) {
  let n = 0;
  const add = (s) => { if (typeof s === 'string') n += s.split(needle).length - 1; };
  for (const t of tasks) {
    add(t.description);
    for (const m of (t.promptGroup || [])) add(m.content);
  }
  add(p.finalSystemDirective);
  return n;
}

const probes = {
  'N-A1 OLD(刷新成功判定标准)': '**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**（后续剧情是否有黄毛实际出场的契机/进入画面的路径/与目标互动的机会）——**若黄毛仅是"存在"（如同楼住户/远房路人）但当前及后续场景都没有其出场与互动的可能 → 判 no_spawn，不空刷新**',
  'N-A2 OLD(HARD RULES 3 head)': '3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：',
  'N-A2 OLD bullet2 (1-space)': ' - 若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能（如同楼住户、远房路人，{{user}} 与对象在家私密互动时黄毛在自己家毫无关联）→ 判 **no_spawn**（不空刷新）',
  'N-A3 OLD(no_spawn头注)': '- **no_spawn**：本轮无黄毛在场。两种情形：',
  'N-A4 OLD(分支A plain)': '② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理（如目标不在场、黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。',
  'N-A5 OLD(分支A ALLin)': '② 分支A——黄毛表已有黄毛但本轮在场不合理（如黄毛人设/场景与本轮冲突、黄毛表该行 lock_status=已离场 等），输出 no_spawn；若无历史锁定的活跃黄毛则下游 stage3 走快速通道。',
  'N-A6 OLD(spawn②行)': '② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛',
  'N-B1 OLD(场景外句 plain)': '**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**',
  'N-B1 OLD(场景外句 ALLin)': '**若黄毛与该目标均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往该目标所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**',
  'N-B2 OLD(场景外标注)': '- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」——该戏发生在 {{user}} 视线外，{{user}} 不知情，stage 记录、prologue 不展开',
  'N-B3 OLD(prologue登场门 no_spawn)': '若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场',
  'N-B3 OLD head(prologue登场门)': 'thugSpawn 状态=no_spawn → 本轮无新黄毛登场',
  'N-C1 OLD(行动不依赖刷新在场 plain)': '**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act（该行动发生在 {{user}} 场景外）。',
  'N-C2 OLD(no-act定义)': '- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。',
};

console.log('\n==== PROBE HIT COUNTS ====');
for (const [k, v] of Object.entries(probes)) {
  console.log(`${countAll(v)}\t${k}`);
}
