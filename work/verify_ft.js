const fs = require('fs');
const j = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json', 'utf8'));
const t1 = j[0].plotTasks[1];
const t2 = j[0].plotTasks[2];
const parts = [];
for (const t of j[0].plotTasks) {
  if (typeof t.description === 'string') parts.push(t.description);
  if (typeof t.finalDirectiveTemplate === 'string') parts.push(t.finalDirectiveTemplate);
  for (const k of Object.keys(t.promptGroup || {})) if (t.promptGroup[k] && typeof t.promptGroup[k].content === 'string') parts.push(t.promptGroup[k].content);
}
parts.push(j[0].finalSystemDirective);
const all = parts.join('\n');
const checks = [
  '② 分支A——已有追踪黄毛：黄毛不在当前场景',
  '胜负确认轮例外',
  '按剧情自然，不作竞争角色登场（男娘系黄毛须留在名单中供投怀戏编排）',
  '黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）',
  '黄毛胜·终局→终局锁定+关系戏',
  '黄毛败·友好→友情收尾场景（对象与黄毛成为好朋友、{{user}} 与对象恋爱确立，黄毛退出竞争；男娘系黄毛败·友好同时推进天意·后宫线',
  '强烈情绪自然缓释（不设数值阈值，按剧情节奏衰减）',
  '【分支 B — 有待刷新目标】',
  '存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛',
  '关系标记列加注 👁️',
  '下一轮若 thugAction=act，恢复完整导演分析',
  '综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）',
  '对象的行为综合判断已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）',
  '女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断）',
  '（对象明确选择/综合判断女主行为已倾向 {{user}}）',
  '伪娘系黄毛（伪娘/药娘/假小子三型）',
  'Log：仅一行「no-act，快速通道输出」',
  '黄毛不踢出追踪**：仍列入【黄毛动向追踪】，后续轮仍可刷新判定互动',
  '1b. **线状态=黄毛胜·终局**的对象：黄毛不踢出追踪、仍可判定行动',
  '追踪中的活跃黄毛（含黄毛胜·终局的对象）仍须进入后续规则判定 act/no-act',
];
let bad = 0;
for (const c of checks) {
  const found = all.includes(c);
  if (!found) bad++;
  console.log((found ? 'FOUND  ' : 'MISSING') + ': ' + c.slice(0, 50));
}
console.log('---structure---');
console.log('topArray:', Array.isArray(j), 'plotTasks len:', j[0].plotTasks.length);
console.log('j[0] keys order:', Object.keys(j[0]).join(','));
console.log(bad === 0 ? 'ALL PRESENT' : bad + ' MISSING');
