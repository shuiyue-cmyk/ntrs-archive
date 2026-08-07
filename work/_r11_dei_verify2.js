const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];

// gather all content strings
const contents = [];
(p.plotTasks || []).forEach(t => (t.promptGroup || []).forEach(m => contents.push(m.content || '')));
(p.promptGroup || []).forEach(m => contents.push(m.content || ''));
contents.push(p.finalSystemDirective || '');
const all = contents.join('\n<<<>>>\n');

const checks = [
  ['item1 full', '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新'],
  ['item2', '**线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定**'],
  ['item4', '本节登场角色分析、九题自检、sparkNotes 一律跳过'],
  ['item5', '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动；若场上存在后宫线对象，附一行后宫互动**）'],
  ['item6', '黄毛是否已写入 prologue 登场角色名单？** 名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？漏写黄毛 = 输出失败'],
  ['item7', '不再有行动判定（**男娘系黄毛除外**：黄毛败·友好为天意·后宫线过渡态，S2 判 act 推进投怀戏；正常男性黄毛不触发天意，按线闭合处理）；{{user}} 与对象正常恋爱（纯爱线）'],
  ['item8', '**无进度标签核验**：<plot> 内是否出现任何进度标签？'],
  ['item9', '👁️ **明面竞争（在场见证）**'],
  ['item10', '（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文；理由必须放在紧随其后的'],
  ['item13', '1-b. **线状态=黄毛胜·终局**'],
  ['item13b', '见规则 1-b'],
  ['item14', '恢复完整导演分析。**【用户本轮输入】**'],
];
console.log('=== content-level NEW text check ===');
for (const [id, s] of checks) {
  console.log(`${id}: ${all.includes(s) ? 'FOUND' : 'MISSING'}`);
}

const gones = [
  ['item1 old', '接下来的场景中该黄毛是否有出现的可能'],
  ['item6 old', '雄竞期标注"竞争者·[五型]"，并标线状态？'],
  ['item8 old', '<ntrsProgress> 或任何进度标签？'],
  ['item9 old', '👁️ **明面竞争**：'],
  ['item13 old', '1b. **线状态=黄毛胜·终局**'],
  ['item14 old', '恢复完整导演分析。【用户本轮输入】**'],
];
console.log('=== content-level OLD check ===');
for (const [id, s] of gones) {
  console.log(`${id}: ${all.includes(s) ? 'STILL PRESENT' : 'GONE'}`);
}

// 8d line: verify no stray duplicate ** artifact
const i6 = all.indexOf('黄毛是否已写入 prologue');
console.log('\n8d exact:', JSON.stringify(all.slice(i6 - 5, i6 + 120)));
// item1 exact
const i1 = all.indexOf('有没有尚无黄毛的角色');
console.log('item1 exact:', JSON.stringify(all.slice(i1, i1 + 130)));
