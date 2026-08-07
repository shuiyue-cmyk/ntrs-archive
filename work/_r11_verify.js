// Verify: JSON parses, top-level array, all NEW texts present
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const raw = fs.readFileSync(target, 'utf8');

let ok = true;
console.log('raw.trim().startsWith("["):', raw.trim().startsWith('['));

let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); }
catch (e) { console.log('JSON.parse FAIL:', e.message); ok = false; process.exit(1); }
console.log('top-level is array:', Array.isArray(j));

const blob = JSON.stringify(j);

const checks = [
  ['item1', '本轮黄毛能否进入 {{user}} 当前场景画面'],
  ['item9', '👁️ **明面竞争（在场见证）**'],
  ['item15', '走亲密开局分流（见下方「对象已站队→亲密开局分流」条款），该目标不进入雄竞期'],
  ['item16', '**亲情/义亲目标计入亲密开局分流**'],
  ['item17', 'c) 已站队的对象（已是 {{user}} 恋人/配偶/血亲义亲）是否**已走亲密开局分流**'],
  ['item18a', '线状态=[雄竞期/NTRS期/NTRS期·亲密开局/黄毛胜·终局]'],
  ['item18a-S2MSG0', '线状态（雄竞期/NTRS期/NTRS期·亲密开局/黄毛胜·终局）'],
  ['item18b', '> - **NTRS期·亲密开局**：目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队/血亲义亲）'],
  ['item18c', '四种线状态之一'],
  ['item18d-stage', '线状态:** [雄竞期 / NTRS期 / NTRS期·亲密开局 / 黄毛胜·终局]'],
  ['item18d-7a', '线状态：雄竞期 / NTRS期 / NTRS期·亲密开局 / 黄毛胜·终局？'],
  ['item18d-spark', '- 线状态：雄竞期 / NTRS期 / NTRS期·亲密开局 / 黄毛胜·终局'],
  ['item19', '黄毛败路径=察觉型 41% 起步；NTRS期·亲密开局路径=忠诚（低接受度完整五阶段起步）'],
  ['item20a', '暗中（亲密开局起步）/ 半明示 / 已默契'],
  ['item20b', '推波助澜姿态: 暗中（亲密开局起步）/ 半明示/已默契'],
  ['item20c', '「暗中→半明示→默契」演进中的位置——暗中（亲密开局起步）/半明示/已默契'],
  ['item20d', '当前在哪（暗中/半明示/已默契——亲密开局自暗中起步）'],
  ['item21', '当前阶段（NTRS期）:** [忠诚型/动摇型/察觉型/默契型/乐享型]'],
  ['item22', 'NTRS期·亲密开局→亲密开局戏（对象出场即与 {{user}} 亲密——接受程度从低接受度完整五阶段起步、推波从暗中起步'],
  ['item23', 'NTRS期·亲密开局同此门槛：察觉型起方可📹，忠诚/动摇期一律 🌙'],
  ['item24', '对象与 {{user}} 是泛泛/熟人/朋友/暧昧（自由身）不影响黄毛刷新与行动判定'],
  ['item25', '**对象情感倾向影响雄竞难度（仅自由身目标）**'],
  ['item26', '**本版淫妻线从察觉型（41%）起步（黄毛败转 NTRS期路径）**'],
  ['item27', '黄毛败路径 41% 起步（忠诚/动摇型不出现）；NTRS期·亲密开局路径从忠诚/动摇起步'],
  ['item30', '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"）'],
];

let fail = 0;
for (const [label, needle] of checks) {
  const cnt = blob.split(needle).length - 1;
  const pass = cnt >= 1;
  if (!pass) fail++;
  console.log(`[${pass ? 'OK' : 'FAIL'}] ${label} count=${cnt}`);
}
console.log(fail === 0 ? 'ALL NEW TEXTS PRESENT' : `${fail} CHECK(S) FAILED`);

// residual old-word scan (should be GONE)
const olds = [
  ['item15-old', '即使对象已站队**（已是 {{user}} 的恋人/配偶/已明确站队 {{user}}）也不豁免'],
  ['item16-old', '**亲情/义亲目标不豁免**'],
  ['item17-old', '是否仍按雄竞判定未豁免'],
  ['item18-old', '雄竞期/NTRS期/黄毛胜·终局'],
  ['item19-old', '首轮基线=察觉型 41%'],
  ['item20a-old', '位置（仅 NTRS期）:** 半明示 / 已默契'],
  ['item20c-old', '「半明示→默契」演进中的位置——半明示/已默契'],
  ['item20d-old', '当前在哪（半明示/已默契）'],
  ['item23-old', '未入 NTRS期一律 🌙 完全不知）'],
  ['item24-old', '恋人/配偶/暧昧/朋友/陌生人/已站队'],
  ['item26-old', '**本版淫妻线从察觉型（41%）起步**：'],
  ['item27-old', '本版 41% 起步，忠诚/动摇型不出现'],
];
console.log('\n--- residual old-word scan ---');
for (const [label, needle] of olds) {
  const cnt = blob.split(needle).length - 1;
  console.log(`[${cnt === 0 ? 'GONE' : 'LEFTOVER!'}] ${label} count=${cnt}`);
}
