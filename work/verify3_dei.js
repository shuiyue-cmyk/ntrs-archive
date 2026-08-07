const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(p, 'utf8');
console.log('bytes', raw.length, 'startsWith[', raw.trimStart().startsWith('['));

// Parse regardless of \uXXXX escaping; collect all string values
const j = JSON.parse(raw);
const strings = [];
(function walk(o) {
  if (typeof o === 'string') strings.push(o);
  else if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === 'object') Object.values(o).forEach(walk);
})(j);
const joined = strings.join('\n');
console.log('top-level array:', Array.isArray(j));

const OLD = {
  G1: '为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）',
  G2: '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等',
  G3: '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**',
  G4: '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：',
};
const NEW = {
  G1: '为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**',
  G2: '本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）',
  G3: '（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面',
  G4: '本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入',
};
for (const k of Object.keys(OLD)) {
  const o = joined.split(OLD[k]).length - 1;
  const n = joined.split(NEW[k]).length - 1;
  console.log(`${k}: OLD residual=${o}  NEW present=${n}  ${o === 0 && n >= 1 ? 'OK' : 'FAIL'}`);
}
console.log('公共空间宽松判定 exact-string (expected 0):', joined.split('公共空间宽松判定').length - 1);
console.log('宽松判定 occurrences:', joined.split('宽松判定').length - 1);
console.log('严格判定 occurrences:', joined.split('严格判定').length - 1);
