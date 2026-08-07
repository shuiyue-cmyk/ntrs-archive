// R9 PART B fix v2: Cirno_NTRS_turn_edit_straight_revise_4.7.json — mutate via obj[key] refs
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';

const raw0 = fs.readFileSync(PATH, 'utf8');
let j;
try { j = JSON.parse(raw0); } catch (e) { console.log('JSON PARSE FAIL at start', e.message); process.exit(1); }
console.log('top array?', Array.isArray(j), '| starts [', raw0.trim().startsWith('['));

const p = j[0];
// hold REAL object refs: obj + key, mutate obj[key] in place
const refs = [];
for (const t of p.plotTasks || []) {
  refs.push({ where: `task[${t.id}].description`, obj: t, key: 'description' });
  (t.promptGroup || []).forEach((m, i) => refs.push({ where: `task[${t.id}].promptGroup[${i}]`, obj: m, key: 'content' }));
}
refs.push({ where: 'finalSystemDirective', obj: p, key: 'finalSystemDirective' });

const pairs = [
  ['B1', `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
         `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`],
  ['B2', `属 📹 事后知情或 🌙 完全不知的暗线戏`,
         `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3', `- 锁定指令：锁定 / 维持背景板`,
         `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3b', `（会经 FSD 给花火·正文）`,
         `（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`],
  ['B4', `· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
         `· 上轮阶段名 + 上轮%：（以 黄毛表 progress_percent 为准；无表行则首轮基线 0%/忠诚型，概览/前文仅作校验）`],
  ['B5', `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
         `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`],
  ['B8a', `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
         `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
  ['B8b', `locked_target 命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`,
         `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`],
  ['B10', `**prologue 黄毛登场角色门（必须）**（依据 \`<thugSpawn>\` + \`<thugAction>\`，违反 = 输出失败）：`,
         `**prologue 黄毛登场角色门（必须）**（依据 \`<thugSpawn>\` + \`<thugAction>\`，违反 = 输出失败；thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）：`],
];

const report = [];
for (const [tag, oldS, newS] of pairs) {
  let total = 0;
  const locs = [];
  for (const r of refs) {
    const val = r.obj[r.key];
    const c = val.split(oldS).length - 1;
    if (c > 0) { r.obj[r.key] = val.split(oldS).join(newS); total += c; locs.push(`${r.where}×${c}`); }
  }
  report.push({ tag, count: total, ok: total > 0, locs });
}
console.log('\n--- apply report ---');
for (const r of report) console.log(`${r.tag}: hit=${r.count} ${r.ok ? 'OK' : 'FAIL'} [${r.locs.join(', ')}]`);

// sanity: assert the object tree actually changed before writing
let changed = 0;
for (const r of refs) changed += r.obj[r.key].length;
console.log('total chars across refs:', changed);

const out = JSON.stringify(j, null, 2);
let parseOk = true, arrOk = out.trim().startsWith('[');
try { JSON.parse(out); } catch (e) { parseOk = false; console.log('WRITE-GUARD PARSE FAIL', e.message); }
if (parseOk && arrOk) {
  fs.writeFileSync(PATH, out, 'utf8');
  console.log('\nWROTE OK, bytes:', Buffer.byteLength(out, 'utf8'), '(was', Buffer.byteLength(raw0, 'utf8') + ')');
} else {
  console.log('WRITE ABORTED parseOk=', parseOk, 'arrOk=', arrOk);
  process.exit(1);
}

// ---- verify: re-read from disk, count OLD/NEW over parsed content fields ----
const rawV = fs.readFileSync(PATH, 'utf8');
let vj; let vparse = true; try { vj = JSON.parse(rawV); } catch (e) { vparse = false; console.log('RE-READ PARSE FAIL', e.message); }
console.log('\n--- verify ---');
console.log('JSON valid:', vparse, '| top array:', Array.isArray(vj), '| starts [:', rawV.trim().startsWith('['));
const p2 = vj[0];
const blobParts = [];
for (const t of p2.plotTasks || []) {
  blobParts.push(t.description || '');
  (t.promptGroup || []).forEach(m => blobParts.push(m.content || ''));
}
blobParts.push(p2.finalSystemDirective || '');
const blob = blobParts.join('\n');
for (const [tag, oldS, newS] of pairs) {
  const oldc = blob.split(oldS).length - 1;
  const newc = blob.split(newS).length - 1;
  console.log(`${tag}: residual OLD=${oldc} (expect 0) | NEW present=${newc} (expect >=1)`);
}
for (const kw of ['锁定目标列表非空', '黄毛败·友好', '线闭合，黄毛不再行动判定', '刷新成功 = 接下来的场景中有出现的可能', '该对象线已闭合，不再推进判定']) {
  const c = blob.split(kw).length - 1;
  if (c > 0) console.log('RESIDUAL-WARN (spec residual):', JSON.stringify(kw), '=', c);
}
for (const kw of ['调度指令，仅供下游', '察觉型 41% 起的目标', '在场/出场是否合理', '与「锁定状态」一致', '黄毛表 progress_percent 为准', '刷新状态/锁定指令为下游调度字段']) {
  console.log('NEW-key:', JSON.stringify(kw), '=', blob.split(kw).length - 1);
}
