const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('JSON PARSE FAIL:', e.message); process.exit(1); }
console.log('JSON valid: true');
console.log('top-level array:', Array.isArray(j));
console.log('raw starts with [:', raw.trim().startsWith('['));
console.log('plotTasks:', j[0].plotTasks.length);

// residual OLD fragments
const oldFrags = {
  G1: '为唯一基准——黄毛**本轮能否进入',
  G2: '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现',
  G3: '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪',
  G4: '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪',
};
for (const [k, f] of Object.entries(oldFrags)) {
  let i = raw.indexOf(f), n = 0;
  while (i !== -1) { n++; i = raw.indexOf(f, i + 1); }
  console.log('residual', k + ':', n);
}
// NEW presence
for (const f of ['公共空间宽松判定', '私密空间严格判定']) {
  let i = raw.indexOf(f), n = 0;
  while (i !== -1) { n++; i = raw.indexOf(f, i + 1); }
  console.log('NEW "' + f + '":', n);
}
// full OLD strings gone
const olds = {
  G1: '以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。',
  G2: '**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**',
  G4: '- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
};
for (const [k, o] of Object.entries(olds)) console.log('full OLD', k, 'gone:', !raw.includes(o));
// NEW full present
const news = {
  G1: '公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定',
  G2: '公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面',
  G4: '私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入',
};
for (const [k, n] of Object.entries(news)) console.log('NEW', k, 'present:', raw.includes(n));
// {[db.*]} untouched count
const dbBlocks = raw.match(/\{\[db\.[^}]*\]\}/g);
console.log('{[db.*]} block count:', dbBlocks ? dbBlocks.length : 0);
