const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('raw head:', JSON.stringify(raw.slice(0, 40)));
console.log('starts with [:', raw.trim().startsWith('['));
let j;
try { j = JSON.parse(raw); console.log('JSON parse OK; top-level isArray:', Array.isArray(j)); }
catch (e) { console.log('JSON parse FAIL:', e.message); process.exit(1); }
console.log('j.length:', j.length, '| j[0].keys:', Object.keys(j[0]).join(','));
console.log('plotTasks count:', (j[0].plotTasks || []).length);
console.log('finalSystemDirective len:', (j[0].finalSystemDirective || '').length);

const olds = {
  A1: '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
  A4a: '若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能',
  A4b: '仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定',
  A5: '黄毛胜·终局落实对象线闭合场景',
  A6: '黄毛胜·终局：该对象线已闭合，不再推进判定）',
  A7: '**线已闭合的对象（黄毛胜·终局，或已转NTRS期的对象）视为仍绑定、不参与刷新、不误判为未绑定**',
  A15: '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）',
};

function countInStr(str, needle) { return str.split(needle).length - 1; }

const blob = JSON.stringify(j, null, 2);
let anyFail = false;
for (const [id, old] of Object.entries(olds)) {
  const n = countInStr(blob, old);
  console.log(`${id}: count=${n} ${n > 0 ? 'FOUND' : '*** 0-HIT ***'}`);
  if (n === 0) anyFail = true;
}
console.log('ANY 0-HIT:', anyFail);
