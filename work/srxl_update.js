// 三人逆行v11.0 两块 NTRS 内容更新：适配当前全部带 NTRS 的剧情推进预设（NTRS12 + NTRS·雄竞 + _2ALL）
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/三人逆行v11.0—PrismFox~NTRS.json';
const raw = fs.readFileSync(p, 'utf8');
const j = JSON.parse(raw);
const byName = (n) => j.prompts.find(x => (x.name || '') === n);

// ========== 块1：ℹ️丨NTRS字段解释 ==========
const b1 = byName('ℹ️丨NTRS字段解释');
if (!b1) { console.log('[FAIL] 找不到 块1'); process.exit(1); }
const edits1 = [
  // 1. plot 条目补调度标记提示
  ['——也是人文化措辞，不写系统调度词。\nthugSpawn：',
   '——也是人文化措辞，不写系统调度词。内嵌的 <ntrsProgress> 等调度标记不写进正文。\nthugSpawn：'],
  // 2. 五型 → 六型
  ['spawn=已刷新新黄毛（含人设/五型/融入方式/锁定状态）', 'spawn=已刷新新黄毛（含人设/六型/融入方式/锁定状态）'],
  // 3. 新增 NTRtrack 条目（插在 thugSpawn 条目后、thugAction 前）——只写正文编排所需动向，不泄漏线状态/进度/分级等调度细节
  ['thugAction：本轮已锁定黄毛是否出手。',
   'NTRtrack：追踪块（紧随 thugSpawn）。【黄毛动向追踪】=每个已刷新黄毛的动向（在场/离场/尾随目标/暗中布局）——离场不等于静止，黄毛可尾随/接近目标；【对象动向追踪】=仅离场对象的位置+状态（一行/对象）——离场对象可有场景外动向戏与回归契机。按此编排动向戏，不在正文复述调度字段。\nthugAction：本轮已锁定黄毛是否出手。'],
  // 4. thugAction 中性化（覆盖 NTRS12 淫妻线 + NTRS·雄竞雄竞期）
  ['act=黄毛本轮出手、NTR 场景升为主线；no-act=黄毛本轮不出手、主线按用户输入走，NTR 只作幕后一瞥/心理渗透的轻度调味，不写显性 NTR 事件、不动身体接触。缺失 thugAction 视为 no-act。',
   'act=黄毛本轮出手，其互动升为主线；no-act=黄毛本轮不出手、主线按用户输入走，黄毛只作幕后一瞥/心理渗透的轻度调味，不写显性 NTR 事件、不动身体接触。缺失 thugAction 视为 no-act。'],
];
let c1 = 0;
for (const [o, n] of edits1) {
  if (b1.content.includes(o)) { b1.content = b1.content.split(o).join(n); c1++; }
  else console.log('[块1 未命中] ' + o.slice(0, 30));
}
console.log('块1 替换段: ' + c1 + '/' + edits1.length);

// ========== 块2：ℹ️丨NTRS_TURN ==========
const b2 = byName('ℹ️丨NTRS_TURN');
if (!b2) { console.log('[FAIL] 找不到 块2'); process.exit(1); }
const edits2 = [
  // 1. 素材列表加 NTRtrack
  ['thugSpawn 黄毛刷新状态、recall/prologue/plot 各段', 'thugSpawn 黄毛刷新状态、NTRtrack 黄毛/对象动向追踪、recall/prologue/plot 各段'],
  // 2. ntrsProgress 措辞通用化
  ['plot 末尾若有 <ntrsProgress> 块直接跳过、不理会不输出与之相关的任何内容',
   'plot 内嵌的 <ntrsProgress> 等调度标记直接跳过、不理会不输出与之相关的任何内容'],
  // 3. act 语义中性化（覆盖雄竞期）
  ['act 档黄毛出手则 NTR 升主线，no-act 档黄毛仅作暗里存在、主线跟用户输入走',
   'act 档黄毛出手则其互动升为主线，no-act 档黄毛仅作暗里存在、主线跟用户输入走'],
];
let c2 = 0;
for (const [o, n] of edits2) {
  if (b2.content.includes(o)) { b2.content = b2.content.split(o).join(n); c2++; }
  else console.log('[块2 未命中] ' + o.slice(0, 30));
}
console.log('块2 替换段: ' + c2 + '/' + edits2.length);

if (c1 !== edits1.length || c2 !== edits2.length) { console.log('[FAIL] 有段未命中，不写盘'); process.exit(1); }

// 写回（保持原 4 空格缩进）
fs.writeFileSync(p, JSON.stringify(j, null, 4), 'utf8');
console.log('已写回（4空格缩进）');

// ========== 验证 ==========
const v = JSON.parse(fs.readFileSync(p, 'utf8'));
const vb1 = byName.call({ prompts: v.prompts }, 'ℹ️丨NTRS字段解释');
const vb2 = byName.call({ prompts: v.prompts }, 'ℹ️丨NTRS_TURN');
console.log('块1 六型: ' + vb1.content.includes('六型') + ' | NTRtrack 条目: ' + vb1.content.includes('NTRtrack：追踪块') + ' | thugAction 新语义: ' + vb1.content.includes('其互动升为主线') + ' | ntrsProgress 提示: ' + vb1.content.includes('调度标记不写进正文'));
console.log('块2 NTRtrack: ' + vb2.content.includes('NTRtrack 黄毛/对象动向追踪') + ' | 中性act: ' + vb2.content.includes('其互动升为主线'));
console.log('缩进: ' + JSON.stringify(fs.readFileSync(p, 'utf8').slice(0, 12)));
console.log('prompts 数: ' + v.prompts.length);
