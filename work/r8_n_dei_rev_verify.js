const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
console.log('startsWith[:', raw.trim().startsWith('['));
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); }
catch (e) { console.log('JSON.parse FAIL:', e.message); process.exit(1); }
console.log('topIsArray:', Array.isArray(j));
const blob = JSON.stringify(j);
const oldPatterns = [
  '刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能',
  '接下来的场景中该黄毛是否有实际出现的可能',
  '若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能',
  '若接下来的场景中黄毛有合理出场路径',
  '本轮无黄毛在场。两种情形',
  '本轮在场不合理（如目标不在场',
  '本轮判定其在场合理',
  'prologue 不展开该场景外戏',
  'stage 记录、prologue 不展开',
  '若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场',
  '也可判 act，该行动发生在 {{user}} 场景外',
  '未真正锁定（背景板/未锁定黄毛天然 no-act）、',
];
const newPatterns = [
  '本轮黄毛能否进入 {{user}} 当前场景画面',
  '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  '本轮无黄毛在 {{user}} 当前场景画面内',
  '已真正锁定且离场攻略目标',
  '本轮判定其在 {{user}} 当前场景画面内合理',
  '正文 content 完整编排该场景外戏',
  'stage 记录 + 正文 content 完整编排该场景外戏',
  '且其本轮 act 行动发生在 {{user}} 当前场景内',
  '目标与 {{user}} 同处当前场景时（黄毛已真正锁定）',
  '锁定前可 spawn 但不得 act',
];
console.log('--- OLD residual counts (expect all 0) ---');
oldPatterns.forEach(o => {
  const c = blob.split(o).length - 1;
  console.log((c === 0 ? 'GONE' : 'RESIDUAL x' + c), '|', o.slice(0, 40));
});
console.log('--- NEW presence counts (expect >=1) ---');
newPatterns.forEach(n => {
  const c = blob.split(n).length - 1;
  console.log((c >= 1 ? 'OK' : 'MISSING'), 'x' + c, '|', n.slice(0, 40));
});
const t = j[0].plotTasks;
console.log('tasks unchanged:', t.map(x => x.id + '|' + x.name).join(' ; '));
console.log('extractTags:', t.map(x => x.id + ':' + x.extractTags).join(' ; '));
console.log('FSD has userCalib?', j[0].finalSystemDirective.includes('userCalib'));
console.log('single-brace {user} scan:', (blob.split('{user}').length - 1));
