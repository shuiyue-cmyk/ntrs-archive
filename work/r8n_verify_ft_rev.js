const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('JSON PARSE: FAIL', e.message); process.exit(1); }
console.log('JSON PARSE: OK');
console.log('top-level array:', Array.isArray(j), 'len:', j.length);
console.log('raw starts with [:', raw.trimStart().startsWith('['));

const texts = [];
texts.push({ tag: 'FSD', s: j[0].finalSystemDirective });
if (Array.isArray(j[0].promptGroup)) j[0].promptGroup.forEach((m, i) => texts.push({ tag: `pg[${i}]`, s: m.content }));
j[0].plotTasks.forEach((p, ti) => {
  if (p.description !== undefined && p.description !== null && p.description !== '')
    texts.push({ tag: `T${ti}.desc`, s: p.description });
  (p.promptGroup || []).forEach((m, i) => texts.push({ tag: `T${ti}.pg[${i}]`, s: m.content }));
});
const blob = texts.map(t => t.s).join('\n');

// residual OLD key phrases
const residuals = [
  '刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能',
  '后续剧情是否有黄毛实际出场的契机',
  '接下来的场景中该黄毛是否有实际出现的可能',
  '若接下来的场景中黄毛有合理出场路径',
  '本轮无黄毛在场。两种情形',
  '本轮在场不合理（如目标不在场',
  '本轮判定其在场合理，沿用已有黄毛',
  'prologue 不展开该场景外戏',
  'stage 记录、prologue 不展开',
  '已锁定的活跃黄毛则仍按"真正锁定"规则登场',
  '也可判 act（该行动发生在 {{user}} 场景外）',
  '未真正锁定（背景板/未锁定黄毛天然 no-act）',
];
let allClean = true;
for (const r of residuals) {
  const n = blob.split(r).length - 1;
  if (n > 0) { allClean = false; console.log('RESIDUAL FOUND:', r, 'x', n); }
}
console.log('residual OLD scan:', allClean ? 'CLEAN (0 hits)' : 'DIRTY');

// NEW key phrases present
const news = [
  '本轮黄毛能否进入 {{user}} 当前场景画面',
  '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动',
  '黄毛不在 {{user}} 当前场景画面内（如目标不在场',
  '本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛',
  '正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌',
  '**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**',
  '且其本轮 act 行动发生在 {{user}} 当前场景内，则按"真正锁定"规则登场编排',
  '**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**',
  '未锁定（背景板）黄毛仍一律 no-act，不适用本条',
  '锁定前可 spawn 但不得 act',
  '（含目标与 {{user}} 同场且黄毛无合理制造离场契机的手段）',
];
let allNew = true;
for (const n of news) {
  const c = blob.split(n).length - 1;
  if (c === 0) { allNew = false; console.log('NEW MISSING:', n); }
}
console.log('NEW present scan:', allNew ? 'ALL PRESENT' : 'MISSING SOME');
console.log('total chars:', raw.length);
