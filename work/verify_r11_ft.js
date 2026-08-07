// Verify applied items on Cirno_BATTLE_Turn_FT.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const buf = fs.readFileSync(path);
const raw = buf.toString('utf8');

let parseOk = true, parseErr = '';
let j;
try { j = JSON.parse(raw); } catch (e) { parseOk = false; parseErr = e.message; }
console.log('JSON.parse ok:', parseOk, parseErr);
console.log('raw starts with [:', raw.startsWith('['));
console.log('top array len:', parseOk ? j.length : 'n/a');
console.log('BOM:', buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF);
console.log('indent head:', JSON.stringify(raw.slice(0, 12)));
console.log('trailing bytes:', JSON.stringify(raw.slice(-4)));

const o = j[0];
const blobs = [];
o.plotTasks.forEach((t, ti) => t.promptGroup.forEach((m, mi) => blobs.push(String(m.content))));
blobs.push(String(o.finalSystemDirective));
const blob = blobs.join('\n---\n');

// [tag, newMarker, oldGone]
const checks = [
  ['1', '**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）', '接下来的场景中该黄毛是否有出现的可能'],
  ['2', '线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定'],
  ['3', '黄毛胜·终局：对象嫁黄毛、**线锁定非闭合**（黄毛仍追踪、夫妻戏可持续）', '黄毛胜·终局：对象嫁黄毛、线闭合'],
  ['4', '本节登场角色分析、九题自检、sparkNotes 一律跳过', '本节登场角色分析、八题自检、sparkNotes 一律跳过'],
  ['5', '；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动；若场上存在后宫线对象，附一行后宫互动**）', '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）'],
  ['6', '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？', '雄竞期标注"竞争者·[五型]"，并标线状态？'],
  ['7', '不再有行动判定（**男娘系黄毛除外**：黄毛败·友好为天意·后宫线过渡态，S2 判 act 推进投怀戏——本版全员男娘系，无正常男性分支）', '不再有行动判定；{{user}} 与对象正常恋爱（纯爱线）。'],
  ['7note', '黄毛败·友好线闭合不再判定（男娘系除外，判 act 推进投怀戏）', '黄毛败·友好线闭合不再判定'],
  ['8', '<plot> 内是否出现任何进度标签？', '<plot> 内是否出现 <ntrsProgress> 或任何进度标签？'],
  ['9', '👁️ **明面竞争（在场见证）**', '👁️ **明面竞争**'],
  ['10', '——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文', '黄毛人设（会经 FSD 给花火·正文）；理由必须放在'],
  ['11', '- Log：仅一行「no-act，快速通道输出」（本版无进度标签，不涉及进度省略）', '- Log：仅一行「no-act，快速通道输出」'],
  ['12a', '本版全员男娘系无正常男性分支——黄毛败·友好（天意待触发）后续轮继续判 act 推投怀戏（线闭合仅指彻底退场，正常男性分支不存在）', '黄毛败·友好的正常男性后续轮回归 no-act（线闭合）'],
  ['12b', '其他败·友好黄毛按剧情自然可淡出（本版全员男娘系，无正常男性分支）', '正常男性/其他败·友好黄毛按剧情自然可淡出'],
];

console.log('\n=== VERIFY (new present / old gone) ===');
let allOk = true;
for (const [tag, marker, oldGone] of checks) {
  const hasNew = blob.includes(marker);
  const hasOld = blob.includes(oldGone);
  const ok = hasNew && !hasOld;
  if (!ok) allOk = false;
  console.log(`item ${tag}: newPresent=${hasNew} oldGone=${!hasOld} ${ok ? 'OK' : '*** FAIL ***'}`);
}
console.log('\nALL VERIFY OK:', allOk);

// role value audit
const roles = [];
o.plotTasks.forEach((t) => t.promptGroup.forEach((m) => roles.push(m.role)));
o.prompts?.forEach((m) => roles.push(m.role));
console.log('\nroles:', JSON.stringify([...new Set(roles)]));
console.log('all roles valid (USER/SYSTEM/assistant):', roles.every((r) => ['USER', 'SYSTEM', 'assistant'].includes(r)));
