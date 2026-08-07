// FINAL verification v2 — scan PARSED content strings (not serialized text)
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_straight_NTRS.json';
const raw = fs.readFileSync(PATH, 'utf8');
const j = JSON.parse(raw);

function collect(node, arr) {
  if (typeof node === 'string') { arr.push(node); return; }
  if (Array.isArray(node)) { for (const v of node) collect(v, arr); return; }
  if (node && typeof node === 'object') { for (const k of Object.keys(node)) collect(node[k], arr); return; }
}
const strs = [];
collect(j, strs);
const joined = strs.join('\n\u0000\n'); // separator that cannot collide

console.log('== structure ==');
console.log('topIsArray:', Array.isArray(j));
console.log('firstNonSpace:', JSON.stringify(raw.trimStart()[0]));
console.log('plotTasks:', j[0].plotTasks.map(t => t.id).join(','));

console.log('== NEW text presence (parsed content) ==');
const checks = [
  ['G1', `该对象线终局锁定：对象与 {{user}} 封顶好朋友、与黄毛成真夫妻级亲密关系。**黄毛不踢出追踪**`],
  ['G2', `；黄毛胜\u00b7终局的对象**仍须列出**（线锁定非闭合，标线状态供 S3 编排夫妻级关系戏）；仅线闭合`],
  ['G3a', `**spawn=本轮黄毛在当前场景在场（或本轮新刷新登场）；黄毛不在当前场景（含离场追踪/场景外行动）=no_spawn**`],
  ['G3b', `- **no_spawn**：本轮无黄毛在当前场景在场（追踪中/离场黄毛仍可能行动）。两种情形：`],
  ['G3c', `② 分支A——已有追踪黄毛：黄毛不在当前场景（离场追踪/场景外行动）`],
  ['G4a', `追踪中的活跃黄毛（含黄毛胜\u00b7终局的对象）仍须进入后续规则判定 act/no-act。`],
  ['G5', `黄毛败（转 NTRS期）的后续轮按 NTRS 期判定逻辑正常判定（淫妻线推进），不回归 no-act；黄毛胜\u00b7终局的后续轮**不**回归 no-act`],
  ['G6', `黄毛胜\u00b7终局→终局锁定+关系戏（对象与黄毛成真夫妻、与 {{user}} 封顶好朋友；黄毛仍在追踪、仍可行动`],
  ['G7', `**黄毛不踢出追踪**：仍列入【黄毛动向追踪】、仍可判定互动——黄毛与对象的夫妻级亲密互动戏可持续编排`],
  ['G8', ` - thugSpawn 状态=spawn 且线状态=黄毛胜\u00b7终局 → 黄毛可写入登场名单（标注"对象的情人/丈夫·[五型]·终局"）`],
  ['G9', `该戏仅写入 stage（标注「场景外场景」），prologue 不展开、黄毛不列入登场名单。`],
  ['G10-1', `黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）（对象转入NTRS期`],
  ['G10-2', `对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）`],
  ['G10-3', `黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）`],
  ['G10-4', `（对象明确选择/综合判断女主行为已倾向 {{user}}）`],
  ['G11', `{{user}} 在场时在关系标记列加注 👁️`],
  ['G12', `下一轮若 thugAction=act，恢复完整导演分析。`],
  ['G13', `- 情绪惯性：强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）`],
  ['G14', `【黄毛刷新状态】spawn=本轮有黄毛在当前场景在场/新刷新登场 / no_spawn=本轮无黄毛在当前场景在场`],
  ['G15a', `本轮查询数据库表格获取黄毛档案数据（黄毛表为型体设定/性器官规则/NTRS期进度；重要角色表为登场角色设定；NTRS备忘录为长期备忘），仅作设定/人设参考，不用于判断已有黄毛：`],
  ['G15a2', `- **黄毛动向追踪为跨轮状态权威**：每轮把场上每个已刷新黄毛的动向`],
  ['G15b', `仅作设定/人设参考，配合 <thugSpawn> 追踪区块使用——运行期线状态/锁定/型体概要/性器官规则以追踪区块与历史刷新记录为准，不从前文猜、不查表判断状态：`],
  ['S4a', `**雄竞期\u00b7胜负核对（以 stage 2 thugSpawn 线状态为准，仅核对剧情事件是否一致）**：thugSpawn 线状态=黄毛胜\u00b7终局？=NTRS期/黄毛败\u00b7友好？未分胜负则雄竞期——禁止 S3 自主判定胜负。`],
  ['S4c', `该节整块省略（场景外 act 且 {{user}} 完全不知🌙 → 该节不输出，仅 stage 记录）`],
  ['S4f', `<thugSpawn> 标签内只放刷新状态+黄毛人设+【黄毛动向追踪】区块`],
  ['S4g', `**淫妻线身体接受度门槛（判定黄毛对目标的身体接触能推进到哪一步，act 档必查；本版 41% 起步，忠诚/动摇型不出现）**：`],
  ['S4h-1', `——经与黄毛的互动积累，对象已察觉 {{user}} 的淫妻癖好、不再抗拒黄毛互动——`],
  ['S4h-2', `<thugSpawn> 标签紧接在 </sparkNotes> 后`],
];
let allOk = true;
for (const [id, frag] of checks) {
  const ok = joined.includes(frag);
  if (!ok) allOk = false;
  console.log(`${id}: ${ok ? 'OK' : 'MISSING'}`);
}
console.log('ALL_NEW_PRESENT:', allOk);

console.log('== OLD residual scan (parsed content, expect 0) ==');
const olds = [
  ['G1', `该对象线终局锁定（对象与 {{user}} 封顶好朋友、与黄毛成真夫妻），后续轮不再判定`],
  ['G2', `黄毛胜\u00b7终局/线闭合的对象不再列出`],
  ['G3a', `黄毛在场或离场均可为 spawn（离场=追踪其去向，仍可行动）`],
  ['G3b', `本轮无黄毛在场/无活跃可行动黄毛`],
  ['G3c', `已有追踪黄毛但该黄毛线已闭合（黄毛胜\u00b7终局）或黄毛彻底离场`],
  ['G4a', `黄毛胜\u00b7终局的对象不再判定）→ 直接判`],
  ['G5', `胜负确认后的后续轮才回归 no-act`],
  ['G6', `黄毛胜\u00b7终局→终局场景（对象与黄毛成真夫妻`],
  ['G7', `该对象后续轮不再参与判定，{{user}} 转攻其他可攻略对象。`],
  ['G9', `即使目标不在场，黄毛尾随/赶赴/暗中行动的戏照常编排`],
  ['G10', `明确且长期拒绝`],
  ['G10-4', `对象明确选择/明确长期拒绝`],
  ['G11', `在 NTR 标记列加注 👁️`],
  ['G12', `若有 spawn 或 act，恢复完整导演分析`],
  ['G13', `强度≥6每轮只衰减1-2点`],
  ['G14', `spawn=本轮有黄毛在场/在追踪 / no_spawn=本轮无黄毛；`],
  ['G15a', `并配合黄毛追踪机制使用：`],
  ['G15a', `- **表格为权威源**：`],
  ['G15a', `- **黄毛动向追踪为跨轮状态补充**：`],
  ['G15b', `本轮查询数据库表格获取黄毛档案权威数据`],
  ['G15b', `本轮查询数据库表格获取权威数据（黄毛表为黄毛条目`],
  ['S4a', `雄竞期\u00b7胜负判定（纯剧情，无数值）`],
  ['S4f', `标签内只放刷新状态+黄毛人设（会经 FSD`],
  ['S4g', `act 档必查）**：敏感角色当前`],
  ['S4h-1', `黄毛的互动积累，已察觉 {{user}}`],
  ['S4h-2', `标签紧接在</sparkNotes>后（thugSpawn→`],
  ['db', `查表判断已有黄毛`],
  ['db', `进度权威源`],
];
let residualAny = false;
for (const [id, o] of olds) {
  const c = joined.split(o).length - 1;
  if (c > 0) { console.log(`  RESIDUAL ${id}: ${c}  <<${o.slice(0, 20)}>>`); residualAny = true; }
}
console.log('RESIDUAL_ANY:', residualAny);

console.log('== injection blocks preserved ==');
for (const b of ['{[db.黄毛表.get()]}', '{[db.重要角色表.get()]}', '{[db.NTRS备忘录.get()]}']) {
  console.log(b, joined.includes(b) ? 'yes' : 'NO');
}
console.log('== G10-1 in task description? ==');
console.log('desc contains 综合判断女主行为已选择:', j[0].plotTasks[1].description.includes('黄毛败=综合判断女主行为已选择{{user}}'));
console.log('desc old phrase gone:', !j[0].plotTasks[1].description.includes('明确且长期拒绝'));
