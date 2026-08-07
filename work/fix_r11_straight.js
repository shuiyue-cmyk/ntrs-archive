const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';

const before = fs.statSync(path).size;
const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) throw new Error('RAW NOT ARRAY BEFORE');
const j = JSON.parse(raw);
if (!Array.isArray(j) || j.length !== 1) throw new Error('TOP NOT ARRAY(1)');

const plotTasks = j[0].plotTasks; // [plotTask2, plotTaskThugTempo, defaultPlotTask]

// msg getter: fresh read from parsed object each time
const msg = (taskIdx, msgIdx) => plotTasks[taskIdx].promptGroup[msgIdx].content;

const rep = (label, taskIdx, msgIdx, oldS, newS, expect = 1) => {
  const cur = msg(taskIdx, msgIdx);
  const n = cur.split(oldS).length - 1;
  if (n !== expect) {
    console.log(`[FAIL] ${label}: count=${n} expected=${expect}`);
    process.exitCode = 1;
    return;
  }
  const out = cur.split(oldS).join(newS);
  if (!out.includes(newS)) { console.log(`[FAIL] ${label}: new text not present after join`); process.exitCode = 1; return; }
  plotTasks[taskIdx].promptGroup[msgIdx].content = out;
  console.log(`[OK] ${label}: replaced ${n}x`);
};

// ---- ITEM 1 (sparkNotes 旧 spawn 措辞 → 当前场景画面基准, P0-1) ----
rep('I1', 1, 4,
  '有没有尚无黄毛的角色，**接下来的场景中该黄毛是否有出现的可能**（有出场契机/进入画面路径/互动机会）？只是"存在"而无出场可能（同楼住户/无关联）→ 不空刷新',
  '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新');

// ---- ITEM 2 (HARD RULE 1 线已闭合→线已定, P0-5) ----
rep('I2', 1, 4,
  '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定、不参与刷新、不误判为未绑定',
  '线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定');

// ---- ITEM 4 (八题自检→九题自检, P1-13) ----
rep('I4', 2, 17,
  '本节登场角色分析、八题自检、sparkNotes 一律跳过',
  '本节登场角色分析、九题自检、sparkNotes 一律跳过');

// ---- ITEM 5 (S3-MSG0 快速通道 prologue 附行, straight) ----
rep('I5', 2, 0,
  '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
  '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动**）');

// ---- ITEM 6 (自检 8d 竞争者标注→内部调度, P1-15) ----
rep('I6', 2, 17,
  '雄竞期标注"竞争者·[五型]"，并标线状态？',
  '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？');

// ---- ITEM 9 (S3-MSG2 三档定义处 👁️ 明面竞争→明面竞争（在场见证）, P2-23) ----
rep('I9', 2, 2,
  '👁️ **明面竞争**',
  '👁️ **明面竞争（在场见证）**');

// ---- ITEM 10 (S2 thugSpawn 调度词「正文不呈现」标注, P2-24; bold spans whole sentence in file) ----
rep('I10', 1, 4,
  '<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）',
  '<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文');

if (process.exitCode) {
  console.log('ABORT: one or more items failed; NOT writing.');
  process.exit(1);
}

const out = JSON.stringify(j, null, 2);
if (!out.trimStart().startsWith('[')) { console.log('ABORT: output not array'); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
const after = fs.statSync(path).size;
console.log('WROTE OK. bytes before=' + before + ' after=' + after + ' delta=' + (after - before));
