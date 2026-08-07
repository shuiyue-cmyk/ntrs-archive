// Verify R10 PART B new content presence & placement
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const blob = JSON.stringify(j);

function count(s, sub) { return s.split(sub).length - 1; }

const checks = {
  'B1-new-bullet1(分流)': '**对象已站队→亲密开局分流（替代雄竞竞争）**',
  'B1-new-bullet2(起点)': '- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步',
  'B2-new(分支B-亲密开局分流)': '【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态',
  'B3-new(desc 分流)': '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）',
  'B4a-new(NTRS期·亲密开局bullet)': '- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**',
  'B4b-new(亲密开局编排标题)': '**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**',
  'B5-new(desc 含亲密开局路径)': '与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局',
  'B6-new(进度一致 含亲密开局)': '3. **进度一致（仅 NTRS期适用，含亲密开局）**',
};
for (const [k, sub] of Object.entries(checks)) {
  console.log(k, '->', count(blob, sub));
}

// placement checks
console.log('--- placement checks ---');
// B1: bullet1 immediately followed by bullet2 (same line-block)
console.log('B1 bullet1 followed by bullet2:', blob.includes('（见 B2）。\n- **亲密开局 NTRS 线起点**：'));
// B2: appended right after 分支B line, before HARD CONSTRAINTS
console.log('B2 right after 分支B:', blob.includes('已有追踪黄毛的目标走分支A 追踪写法。\n【分支 B-亲密开局分流】：'));
// B4a: new bullet right after NTRS期 bullet, before 黄毛胜·终局 bullet
console.log('B4a right after NTRS期 bullet:', blob.includes('黄毛真情约束）。\n- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**'));
console.log('B4a new bullet before 黄毛胜·终局:', blob.includes('41% 察觉型起步）。\n- **黄毛胜·终局**'));
// B4b: heading right after 编排标题 line
console.log('B4b right after 编排标题:', blob.includes('黄毛败后激活）】**\n**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**'));
// B5: desc sentence now ends with 亲密开局路径 before ，黄毛胜·终局
console.log('B5 desc placement:', blob.includes('察觉型起📹事后知情），黄毛胜·终局落实'));
// B6: new sentence is a full line; old 此项不适用。end replaced
console.log('B6 new tail:', blob.includes('此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。'));

// locate which fields were edited: report str indices of B4b title + B6
function findLocations(s, sub) {
  const res = [];
  let idx = -1;
  while ((idx = s.indexOf(sub, idx + 1)) >= 0) res.push(idx);
  return res;
}
// walk to find which task/msg contains each new marker
function collectLeaves(obj, acc) {
  if (typeof obj === 'string') { acc.push(obj); return; }
  if (Array.isArray(obj)) { for (const v of obj) collectLeaves(v, acc); return; }
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) collectLeaves(obj[k], acc); }
}
const leaves = [];
collectLeaves(j, leaves);
for (const [name, sub] of Object.entries(checks)) {
  const hitIdx = leaves.findIndex(s => s.includes(sub));
  console.log('leaf for', name, '-> index', hitIdx, 'len', hitIdx >= 0 ? leaves[hitIdx].length : '-');
}
