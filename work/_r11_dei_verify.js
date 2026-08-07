const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');

// 1. JSON valid + top-level array
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); }
catch (e) { console.log('JSON.parse FAILED:', e.message); process.exit(1); }
console.log('starts with [:', raw.trimStart().startsWith('['));
console.log('isArray:', Array.isArray(j), 'len:', j.length);

const p = j[0];
const blob = JSON.stringify(j);

const mustBePresent = [
  ['item1', '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**'],
  ['item1b', '同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新'],
  ['item2', '**线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定**'],
  ['item4', '本节登场角色分析、九题自检、sparkNotes 一律跳过'],
  ['item5', '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动；若场上存在后宫线对象，附一行后宫互动**）'],
  ['item6', '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？'],
  ['item7', '不再有行动判定（**男娘系黄毛除外**：黄毛败·友好为天意·后宫线过渡态，S2 判 act 推进投怀戏；正常男性黄毛不触发天意，按线闭合处理）；{{user}} 与对象正常恋爱'],
  ['item8', '<plot> 内是否出现任何进度标签？'],
  ['item9', '👁️ **明面竞争（在场见证）**'],
  ['item10', '（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文；理由必须放在紧随其后的'],
  ['item13a', '1-b. **线状态=黄毛胜·终局**'],
  ['item13b', '见规则 1-b'],
  ['item14', '恢复完整导演分析。**【用户本轮输入】**'],
];

console.log('\n=== NEW text presence ===');
for (const [id, s] of mustBePresent) {
  const n = blob.split(s).length - 1;
  console.log(`${id}: ${n > 0 ? 'FOUND x' + n : 'MISSING'}`);
}

const mustBeGone = [
  ['item1_old', '接下来的场景中该黄毛是否有出现的可能'],
  ['item2_old', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定'],
  ['item4_old', '本节登场角色分析、八题自检'],
  ['item6_old', '雄竞期标注"竞争者·[五型]"，并标线状态？'],
  ['item8_old', '<plot> 内是否出现 <ntrsProgress> 或任何进度标签？'],
  ['item9_old', '👁️ **明面竞争**：'],
  ['item13_old_a', '1b. **线状态=黄毛胜·终局**'],
  ['item13_old_b', '见规则 1b'],
  ['item14_old', '恢复完整导演分析。【用户本轮输入】**'],
];
console.log('\n=== OLD text residual ===');
for (const [id, s] of mustBeGone) {
  const n = blob.split(s).length - 1;
  console.log(`${id}: ${n === 0 ? 'GONE' : 'STILL PRESENT x' + n}`);
}

// item5 old still needed? The bare (不复述...) should be gone (replaced with appended version) — check
const bare5 = blob.split('（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）').length - 1;
console.log('item5_bare_old:', bare5 === 0 ? 'GONE' : 'STILL x' + bare5);

// item14 final exact line dump
const i14 = blob.indexOf('恢复完整导演分析');
console.log('\nitem14 final:', JSON.stringify(blob.slice(i14 - 30, i14 + 45)));

// item6 final 8d line dump
const i6 = blob.indexOf('黄毛是否已写入 prologue 登场角色名单');
console.log('item6 final:', JSON.stringify(blob.slice(i6, i6 + 130)));

// item13 TRIGGER RULES numbered lines final
const T1 = JSON.stringify(p.plotTasks[1]);
const tr = T1.slice(T1.indexOf('TRIGGER RULES'), T1.indexOf('TRIGGER RULES') + 1300);
const lines = tr.split('\\n');
console.log('\n=== TRIGGER RULES markers (final) ===');
for (const l of lines) if (/^(\d+[a-z]?\.)\s/.test(l)) console.log(l.slice(0, 50));

// role values check
const roles = new Set();
(p.plotTasks || []).forEach(t => (t.promptGroup || []).forEach(m => roles.add(m.role)));
(p.promptGroup || []).forEach(m => roles.add(m.role));
console.log('\nroles used:', [...roles].join(', '));
console.log('size change:', Buffer.byteLength(raw, 'utf8') - 140655, 'bytes (new-raw vs old 140655)');
