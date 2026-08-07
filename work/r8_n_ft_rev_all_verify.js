const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); }
catch (e) { console.log('JSON.parse: FAIL', e.message); process.exit(1); }
console.log('top-level array (starts with [):', raw.trim().startsWith('['));
console.log('topArray isArray:', Array.isArray(j));
const p = j[0];
const blob = JSON.stringify(p);
const olds = [
  '接下来的场景中是否会有黄毛出现的可能',
  '后续剧情是否有黄毛实际出场的契机',
  '本轮无黄毛在场。两种情形',
  '黄毛表已有黄毛但本轮在场不合理',
  '本轮判定其在场合理，沿用已有黄毛',
  'prologue 不展开该场景外戏',
  'stage 记录、prologue 不展开',
  '若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场。',
  '也可判 act，该行动发生在 {{user}} 场景外）**目标与',
  '天然 no-act）、或已锁定但本轮该留白',
];
const news = [
  '本轮黄毛能否进入 {{user}} 当前场景画面',
  '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  '本轮无黄毛在 {{user}} 当前场景画面内',
  '黄毛表已有黄毛但黄毛不在 {{user}} 当前场景画面内',
  '本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛',
  '正文 content 完整编排该场景外戏',
  '**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**',
  '若有上一轮已真正锁定的活跃黄毛',
  '可主动制造目标离开 {{user}} 场景的机会',
  '锁定前可 spawn 但不得 act',
];
let allClean = true;
for (const o of olds) {
  const c = blob.split(o).length - 1;
  if (c !== 0) allClean = false;
  console.log('OLD residual', JSON.stringify(o.slice(0, 16)), 'count=', c);
}
for (const n of news) {
  const c = blob.split(n).length - 1;
  if (c === 0) allClean = false;
  console.log('NEW present', JSON.stringify(n.slice(0, 16)), 'count=', c);
}
console.log('plotTasks:', p.plotTasks.length, '| FSD len:', p.finalSystemDirective.length);
console.log('ALL CLEAN:', allClean);
