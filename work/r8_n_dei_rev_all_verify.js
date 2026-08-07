// Verify Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json after R8 N-extension fix
const fs = require('fs');
const jsonPath = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';

const raw = fs.readFileSync(jsonPath, 'utf8');
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); }
catch (e) { console.log('JSON.parse: FAIL', e.message); process.exit(1); }
console.log('top-level array:', Array.isArray(j), 'len:', j.length);
console.log('raw starts with [ :', raw.trimStart().startsWith('['));
console.log('preset name:', j[0].name);

const strs = [];
const collect = (s) => { if (typeof s === 'string') strs.push(s); };
for (const t of j[0].plotTasks) {
  collect(t.description);
  for (const m of (t.promptGroup || [])) collect(m.content);
}
collect(j[0].finalSystemDirective);
const all = strs.join('\n');

const OLD_MARKERS = {
  'N-A1 residual(刷新成功判定标准=接下来的场景)': '**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**',
  'N-A2 residual(接下来的场景中该黄毛是否有实际出现)': '**接下来的场景中该黄毛是否有实际出现的可能**',
  'N-A2 residual(若黄毛只是"存在")': '若黄毛只是"存在"但当前与后续场景都没有出场与互动的可能',
  'N-A3 residual(本轮无黄毛在场)': '- **no_spawn**：本轮无黄毛在场。两种情形：',
  'N-A5 residual(黄毛表已有黄毛但本轮在场不合理)': '② 分支A——黄毛表已有黄毛但本轮在场不合理',
  'N-A6 residual(本轮判定其在场合理，沿用已有黄毛)': '本轮判定其在场合理，沿用已有黄毛',
  'N-B1 residual(prologue 不展开该场景外戏)': 'prologue 不展开该场景外戏',
  'N-B2 residual(stage 记录、prologue 不展开)': 'stage 记录、prologue 不展开',
  'N-B3 residual(仍按"真正锁定"规则登场。)': '若有上一轮已锁定的活跃黄毛则仍按"真正锁定"规则登场',
  'N-C1 residual(即使本轮 no_spawn、目标与黄毛均不在)': '即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act，该行动发生在 {{user}} 场景外）',
  'N-C2 residual(天然 no-act)、或已锁定)': '未真正锁定（背景板/未锁定黄毛天然 no-act）、或已锁定',
};

console.log('\n==== RESIDUAL SCAN (OLD must be 0) ====');
let residual = 0;
for (const [k, v] of Object.entries(OLD_MARKERS)) {
  const n = all.split(v).length - 1;
  if (n) residual += n;
  console.log(`${n}\t${k}`);
}

const NEW_MARKERS = {
  'N-A1 NEW(本轮黄毛能否进入 {{user}} 当前场景画面)': '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**',
  'N-A2 NEW(以 {{user}} 本轮当前场景画面为唯一基准)': '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  'N-A3 NEW(本轮无黄毛在 {{user}} 当前场景画面内)': '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内',
  'N-A5 NEW(黄毛表已有黄毛但黄毛不在)': '② 分支A——黄毛表已有黄毛但黄毛不在 {{user}} 当前场景画面内',
  'N-A6 NEW(判定其在 {{user}} 当前场景画面内合理)': '本轮判定其在 {{user}} 当前场景画面内合理，沿用已有黄毛',
  'N-B1 NEW(正文 content 完整编排该场景外戏)': '正文 content 完整编排该场景外戏（读者可见黄毛与该目标的互动全貌',
  'N-B2 NEW(stage 记录 + 正文 content 完整编排)': '**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**',
  'N-B3 NEW(已真正锁定的活跃黄毛，且其本轮 act)': '若有上一轮已真正锁定的活跃黄毛，且其本轮 act 行动发生在 {{user}} 当前场景内',
  'N-C1 NEW(目标与 {{user}} 同处当前场景时)': '**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**',
  'N-C1 NEW(未锁定背景板黄毛仍一律 no-act)': '**未锁定（背景板）黄毛仍一律 no-act，不适用本条**',
  'N-C2 NEW(锁定前可 spawn 但不得 act)': '未真正锁定（背景板/未锁定黄毛天然 no-act，锁定前可 spawn 但不得 act）',
};

console.log('\n==== NEW PRESENCE (must be >=1) ====');
let newMissing = 0;
for (const [k, v] of Object.entries(NEW_MARKERS)) {
  const n = all.split(v).length - 1;
  if (!n) newMissing++;
  console.log(`${n}\t${k}`);
}

// sanity: {[db.*]} blocks untouched
const dbCount = (all.match(/\{\[db\.[\s\S]*?\]\}/g) || []).length;
console.log('\n{[db.*]} blocks present:', dbCount);
console.log('RESIDUAL total:', residual, '| NEW missing:', newMissing);
