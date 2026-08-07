const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const topArray = raw.trimStart().startsWith('[');
const j = JSON.parse(raw); // throws if invalid
const p = j[0];
const fields = [];
for (const t of p.plotTasks || []) {
  if (t.description) fields.push(t.description);
  for (const m of t.promptGroup || []) if (m.content) fields.push(m.content);
}
fields.push(p.finalSystemDirective || '');
const blob = fields.join('\n');

const oldGone = {
  A1: '刷新成功 = 接下来的场景中有出现的可能',
  A2: '线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合，黄毛不再行动判定',
  A8: '黄毛胜·终局落实对象线闭合场景',
  A9: '黄毛胜/黄毛败则线闭合锁定',
  A10: '黄毛胜·终局：对象嫁黄毛、线闭合',
  A11: '**正常男性则线闭合不再列出**；仅彻底离场不再列入行动判定',
  A12: '不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿',
  A13: '或淡出——按剧情自然，不作竞争角色登场。',
  A15: '只能 📹 事后知情或 🌙 完全不知）',
  A16: '（标注"竞争者·[五型]·雄竞期"）。',
  A17: '（跳过导演分析，prologue 仅一行主线推进）。',
};
const newPresent = {
  A1: '刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn',
  A2: '线状态=黄毛胜·终局 → 线锁定非闭合，黄毛仍按追踪判定互动',
  A8: '黄毛胜·终局落实线锁定场景',
  A9: '黄毛胜则线锁定（非闭合，夫妻戏可持续）；黄毛败则线闭合（黄毛退居朋友位）',
  A10: '黄毛胜·终局：对象嫁黄毛、**线锁定非闭合**',
  A11: '**正常男性败·友好确认轮仍须列出**',
  A12: '**男娘系黄毛败·友好（天意待触发）单列**',
  A13: '**男娘系（天意待触发）必须写入名单供投怀戏编排，禁止淡出**',
  A15: '📹 事后知情=事后得知，🌙=事后也不知情',
  A16: '以剧情语言写"追求者/情敌·[外貌气质]"',
  A17: '若场上存在已闭合（黄毛败·友好）对象，快速通道 prologue 附一行该对象的日常互动（朋友级）；若场上存在后宫线对象，附一行后宫互动',
};

console.log('topIsArray:', topArray);
console.log('JSON.parse: OK');
for (const [k, v] of Object.entries(oldGone)) {
  console.log(`${k} old residual: ${(blob.split(v).length - 1)}`);
}
for (const [k, v] of Object.entries(newPresent)) {
  console.log(`${k} new present: ${(blob.split(v).length - 1)}`);
}
// spec residual scans
const specResidual = {
  '刷新成功 = 接下来的场景中有出现的可能': 0,
  '线已闭合，黄毛不再行动判定': 0,
  '线闭合锁定': 0,
};
console.log('--- spec residual scan ---');
for (const [v, expect] of Object.entries(specResidual)) {
  console.log(`"${v}": ${blob.split(v).length - 1} (expect ${expect})`);
}
// count per-fix occurrences to be sure A15 both spots done
console.log('A15 new count:', blob.split('📹 事后知情=事后得知，🌙=事后也不知情').length - 1);
