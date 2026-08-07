// Verify pass v2: scan PARSED string values (no JSON-escaping artifacts)
const fs = require('fs');
const file = process.argv[2];
const raw = fs.readFileSync(file, 'utf8');
const j = JSON.parse(raw);
const vals = [];
(function walk(node) {
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (typeof v === 'string') vals.push(v); else walk(v);
    }
  }
})(j);
const blob = vals.join('\n>>>\n');
console.log('jsonParse: OK | topArray:', raw.trimStart().startsWith('['), '| tasks:', j[0].plotTasks.length);

const present = [
  ['G1', '**黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动'],
  ['G2', '黄毛胜·终局的对象**仍须列出**（线锁定非闭合'],
  ['G3a', '**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）'],
  ['G3b', '本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）'],
  ['G3c', '→ no-act。行动判定为 no-act 时下游 stage3 走快速通道'],
  ['G4a', '追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定'],
  ['G4b', '**线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动'],
  ['G5', '黄毛胜·终局的后续轮**不**回归 no-act'],
  ['G6', '黄毛胜·终局→终局锁定+关系戏（对象与黄毛成真夫妻'],
  ['G7', '黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动'],
  ['G8', 'thugSpawn 状态=spawn 且线状态=黄毛胜·终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）'],
  ['G8-line', '若本轮为场景外行动则不列入登场名单（见场景外标注规则）'],
  ['G9', '该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单'],
  ['G10-1', '黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}；对象与黄毛变好朋友'],
  ['G10-2', '对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）'],
  ['G10-3', '黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）'],
  ['G10-4', '（对象明确选择/综合判断女主行为已倾向 {{user}}）'],
  ['G10-5', '女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）'],
  ['G10-6', '综合判断女主行为已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）——该对象线**闭合**'],
  ['G11', '在关系标记列加注 👁️'],
  ['G12', '下一轮若 thugAction=act，恢复完整导演分析'],
  ['G13', '情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）'],
  ['G14', 'spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场'],
  ['S1a', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定'],
  ['S1b', '<plot> 内是否出现任何进度标签？'],
  ['S1c', '型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]；性器官规则=[1句，如"勃起时足够粗长持久，未勃起时不明显"]'],
  ['S1d-624', 'prologue 不展开该场景外戏**（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️'],
  ['S1d-884', 'stage 记录、prologue 不展开（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️'],
  ['S1e', '（确认轮=胜负事件于本轮输入/剧情中新出现的那一轮；上轮已确认的胜负，本轮为后续轮）'],
  ['S1f-B', '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标'],
  ['S1f-A', '该目标不再刷新新黄毛，改为把该黄毛本轮动向列入'],
];
let bad = 0;
console.log('--- new-text scan (parsed values) ---');
for (const [id, pat] of present) {
  const n = blob.split(pat).length - 1;
  if (n < 1) { console.log('MISSING!', id, 'count=', n); bad++; }
  else console.log('found OK:', id, 'x' + n);
}
// residual: no leftover 明确且长期拒绝 / 明确长期拒绝 / NTR 标记列
const residual = [
  '明确且长期拒绝', '明确长期拒绝', 'NTR 标记列', '强度≥6', '<ntrsProgress>',
  '或NTRS版已转NTRS期', '一气到底不再刷新新黄毛', '黄毛胜·终局/线闭合的对象不再列出',
  '本轮无黄毛在场/无活跃可行动黄毛', '下一轮若有 spawn 或 act',
  '黄毛胜·终局→终局场景（对象与黄毛成真夫妻', '胜负确认后的后续轮才回归 no-act',
  '【分支 B — 无追踪黄毛】', '该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。',
  '黄毛在场或离场均可为 spawn（离场=追踪其去向',
];
console.log('--- residual (should all be 0) ---');
for (const pat of residual) {
  const n = blob.split(pat).length - 1;
  if (n !== 0) { console.log('RESIDUAL!', pat, 'x' + n); bad++; }
  else console.log('gone OK:', pat);
}
// G8 ordering check: 终局 line must sit between 黄毛败·友好 line and no_spawn line
const order = vals.join('\n');
const i1 = order.indexOf('thugSpawn 状态=spawn 且线状态=黄毛败·友好');
const i2 = order.indexOf('thugSpawn 状态=spawn 且线状态=黄毛胜·终局');
const i3 = order.indexOf('thugSpawn 状态=no_spawn');
console.log('--- G8 ordering (败友好 < 终局 < no_spawn):', i1 >= 0 && i1 < i2 && i2 < i3 ? 'OK' : 'BAD', i1, i2, i3);
if (!(i1 < i2 && i2 < i3)) bad++;
console.log(bad === 0 ? '=== VERIFY PASS: all clean ===' : '=== VERIFY FAIL: ' + bad + ' problems ===');
