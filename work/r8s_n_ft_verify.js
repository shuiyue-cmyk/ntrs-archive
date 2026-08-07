const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('JSON parse OK:', (() => { try { JSON.parse(raw); return true; } catch (e) { return e.message; } })());
console.log('top-level array (starts with [):', raw.trimStart().startsWith('['));

const residual = [
  ['G1 旧句式 为唯一基准——黄毛**本轮能否进入', '为唯一基准——黄毛**本轮能否进入'],
  ['G2 旧括号 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现', '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现'],
  ['G3 旧列举 黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪', '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪'],
  ['G4 旧列举 本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪', '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪'],
];
for (const [label, pat] of residual) console.log(`残扫 ${label}: ${raw.includes(pat) ? 'STILL PRESENT (FAIL)' : 'GONE'}`);

const need = ['公共空间宽松判定', '私密空间严格判定', '公共空间宽松：同处该公共空间', '私密空间严格：须实际进入该私密空间画面', '门外走廊'];
for (const pat of need) console.log(`NEW 存在「${pat}」:`, raw.includes(pat), 'count:', raw.split(pat).length - 1);

// confirm {[db.*]} untouched — count before/after would need orig; just confirm no stray edits: G-blocks only
console.log('文件含 {[db.', raw.includes('{[db.'), 'count:', raw.split('{[db.').length - 1);
