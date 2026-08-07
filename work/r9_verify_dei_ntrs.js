const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('bytes on disk:', Buffer.byteLength(raw, 'utf8'));
console.log('starts with [:', raw.trim().startsWith('['));
let j;
try { j = JSON.parse(raw); console.log('JSON parse OK; top-level isArray:', Array.isArray(j), '| j.length:', j.length); }
catch (e) { console.log('JSON parse FAIL:', e.message); process.exit(1); }
const blob = JSON.stringify(j, null, 2);
const c = (s) => blob.split(s).length - 1;

console.log('--- OLD residual (must be 0) ---');
const olds = {
  A1: '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
  A4a: '若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能',
  A4b: '仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定',
  A5: '黄毛胜·终局落实对象线闭合场景',
  A6: '黄毛胜·终局：该对象线已闭合，不再推进判定）',
  A7: '**线已闭合的对象（黄毛胜·终局，或已转NTRS期的对象）视为仍绑定、不参与刷新、不误判为未绑定**',
  A15: '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）',
};
for (const [id, o] of Object.entries(olds)) console.log(`${id} residual:`, c(o));

console.log('--- NEW present (must be >=1) ---');
const news = {
  A1: '本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn',
  A4a: '若黄毛线已收束（黄毛败转NTRS期后该线由 NTRS 判定接管）或黄毛彻底离场再无行动可能',
  A4b: '仅彻底离场再无行动可能的黄毛不再列入行动判定（黄毛败转NTRS期后按 NTRS 期判定，黄毛胜·终局仍按追踪判定互动）',
  A5: '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活）',
  A6: '黄毛胜·终局：该对象线锁定非闭合——胜负不再推进，但黄毛行动/互动判定照常（夫妻级亲密戏可持续））',
  A7: '**线已定对象（黄毛胜·终局，或已转NTRS期）视为仍绑定、不参与刷新、不误判为未绑定（黄毛胜·终局=线锁定非闭合，仅不再刷新新黄毛）**',
  A15: '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️；📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标，未入 NTRS期一律 🌙 完全不知）',
};
for (const [id, n] of Object.entries(news)) console.log(`${id} new present:`, c(n));

console.log('--- db blocks ---');
const dbBlocks = blob.match(/\{\[db[^\]]*\]\}/g) || [];
console.log('db blocks count:', dbBlocks.length, '| all intact:', dbBlocks.every(b => /^\{\[db[a-zA-Z0-9_.]*\]\}$/.test(b)));
console.log(dbBlocks.join(' '));

console.log('--- spec residual phrases ---');
console.log('黄毛败·友好 (must be 0 for NTRS):', c('黄毛败·友好'));
console.log('线闭合，黄毛不再行动判定 old-form:', c('线已闭合，黄毛不再行动判定'));
console.log('刷新成功 = 接下来的场景中有出现的可能:', c('刷新成功 = 接下来的场景中有出现的可能'));
console.log('该对象线已闭合，不再推进判定:', c('该对象线已闭合，不再推进判定'));
console.log('锁定目标列表非空:', c('锁定目标列表非空'));
console.log('NEW phrase 线锁定非闭合:', c('线锁定非闭合'));
console.log('NEW phrase 41% 察觉型起:', c('41% 察觉型起'));
console.log('NEW phrase 调度指令，仅供下游:', c('调度指令，仅供下游'));
console.log('NEW phrase 潜在黄毛[未锁定·背景板]:', c('潜在黄毛[未锁定·背景板]'));
console.log('single-brace {user} leak:', c('{user}') - c('{{user}}'));
