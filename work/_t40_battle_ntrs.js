// T40: BATTLE NTRS 三版接入三表注入（保留追踪机制，表格为权威源）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];

// 三表注入块（通用）
const TABLES = `本轮查询数据库表格获取权威数据（黄毛表为黄毛条目/型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：

<黄毛表当前条目>
{[db.黄毛表.get()]}
</黄毛表当前条目>

<重要角色表当前条目>
{[db.重要角色表.get()]}
</重要角色表当前条目>

<NTRS备忘录当前条目>
{[db.NTRS备忘录.get()]}
</NTRS备忘录当前条目>`;

const results = [];
for (const fn of files) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  const r = {};

  // S2 MSG2："不读取任何表格"段 → 表格权威源 + 追踪互补
  const m2 = t2.promptGroup[2];
  const old2 = `**本判定任务不读取任何表格**（不依赖黄毛表）：所有已刷新黄毛的状态须从上方<前文剧情>/事件概览/记忆召回锚点中自行梳理追踪——每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜·终局）写进 <thugSpawn> 的【黄毛动向追踪】区块。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。`;
  const new2 = `本轮查询数据库表格获取权威数据，并配合黄毛追踪机制使用：
- **表格为权威源**：黄毛表（锁定对象/lock_status/进度条/型体设定/性别类型/五型）、重要角色表（登场角色设定）、NTRS备忘录（长期备忘）——查表判断已有黄毛与沿用设定；
- **黄毛动向追踪为跨轮状态补充**：每轮把场上每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）、线状态（雄竞期/NTRS期/黄毛胜·终局）写进 <thugSpawn> 的【黄毛动向追踪】区块。**目标离场不意味着黄毛停摆**：黄毛可尾随/赶赴/潜伏接近目标所在处继续行动。
${TABLES}`;
  const p2 = m2.content.split(old2);
  if (p2.length === 2) { m2.content = p2[0] + new2 + p2[1]; r['S2表格接入'] = 'OK'; }
  else r['S2表格接入'] = 'FAIL ' + (p2.length - 1);

  // S3 MSG15："不依赖任何表格"段 → 表格权威源
  const m15 = t3.promptGroup[15];
  const isFT = fn.includes('FT') || fn.includes('DEI');
  const oldBody = isFT ? '本变体药娘的手术状态与伟哥规则' : '型体概要/性器官规则';
  const old15A = `本预设不依赖任何表格：已刷新黄毛的型体概要/性器官规则/线状态从 <thugSpawn> 标签内的【黄毛动向追踪】与黄毛人设字段直读（无表格注入，黄毛追踪每轮由 stage 2 输出维护）。`;
  const old15B = `本预设不依赖任何表格：已刷新黄毛的体位/伟哥/手术状态规则/线状态从 <thugSpawn> 标签内的【黄毛动向追踪】与黄毛人设字段直读（无表格注入，黄毛追踪每轮由 stage 2 输出维护）。`;
  const new15 = `本轮查询数据库表格获取黄毛档案权威数据（黄毛表为型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘），配合 <thugSpawn> 追踪区块使用：
${TABLES}`;
  let p15 = m15.content.split(old15A);
  if (p15.length !== 2) p15 = m15.content.split(old15B);
  if (p15.length === 2) { m15.content = p15[0] + new15 + p15[1]; r['S3表格接入'] = 'OK'; }
  else r['S3表格接入'] = 'FAIL ' + (p15.length - 1);

  fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
  results.push(fn + ' | ' + Object.entries(r).map(([k, v]) => k + ':' + v).join(' | '));
}
console.log(results.join('\n'));
