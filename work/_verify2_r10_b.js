// Verify R10 PART B placement on parsed leaves (real newlines)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));

function collectLeaves(obj, acc) {
  if (typeof obj === 'string') { acc.push(obj); return; }
  if (Array.isArray(obj)) { for (const v of obj) collectLeaves(v, acc); return; }
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) collectLeaves(obj[k], acc); }
}
const leaves = [];
collectLeaves(j, leaves);
const blob = leaves.join('\n<<<>>>\n'); // real newlines preserved

const placement = {
  'B1: bullet1→bullet2 邻接': '（见 B2）。\n- **亲密开局 NTRS 线起点**：',
  'B2: 分支B行后紧跟新句': '已有追踪黄毛的目标走分支A 追踪写法。\n【分支 B-亲密开局分流】：',
  'B4a: NTRS期 bullet 后紧跟新 bullet': '黄毛真情约束）。\n- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**',
  'B4a: 新 bullet 在 黄毛胜·终局 之前': '41% 察觉型起步）。\n- **黄毛胜·终局**',
  'B4b: 编排标题后紧跟新标题': '黄毛败后激活）】**\n**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**',
  'B5: desc 句尾接 ，黄毛胜·终局': '察觉型起📹事后知情），黄毛胜·终局落实',
  'B6: 新句尾完整': '此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。',
};
for (const [k, sub] of Object.entries(placement)) {
  console.log(k, '->', blob.split(sub).length - 1);
}

// context dumps for the edited spots
function showAround(marker, before = 40, after = 120) {
  const idx = blob.indexOf(marker);
  if (idx < 0) { console.log('  [marker not found]'); return; }
  console.log('  ...' + JSON.stringify(blob.slice(Math.max(0, idx - before), idx + after)) + '...');
}
console.log('\n--- B1 context ---');
showAround('**对象已站队→亲密开局分流');
console.log('\n--- B2 context ---');
showAround('【分支 B-亲密开局分流】：');
console.log('\n--- B4a context ---');
showAround('**NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**');
console.log('\n--- B4b context ---');
showAround('**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**');
console.log('\n--- B5 context ---');
showAround('含亲密开局路径：');
console.log('\n--- B6 context ---');
showAround('3. **进度一致（仅 NTRS期适用，含亲密开局）**');
