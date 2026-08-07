// Verify r11 edits on DEI_NTRS: parse ok, top array, NEW texts present, OLD texts gone
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('JSON PARSE FAIL: ' + e.message); process.exit(1); }
console.log('JSON parse: OK');
console.log('raw starts with [ : ' + raw.trim().startsWith('['));
const o = Array.isArray(j) ? j[0] : j;
console.log('top-level is array: ' + Array.isArray(j));
console.log('name: ' + o.name);
console.log('plotTasks count: ' + (o.plotTasks || []).length);

const blobs = [];
(o.plotTasks || []).forEach((t, ti) => {
  (t.promptGroup || []).forEach((m, mi) => {
    blobs.push({ label: `T${ti}.pg[${mi}] ${m.role}`, content: String(m.content) });
  });
});
function count(needle) {
  let t = 0;
  blobs.forEach((b) => { t += b.content.split(needle).length - 1; });
  return t;
}

const NEW = [
  ['1', 1, '本轮黄毛能否进入 {{user}} 当前场景画面'],
  ['9', 1, '👁️ **明面竞争（在场见证）**'],
  ['15', 1, '→ 黄毛即出手。**对象已站队**（恋人/配偶/已明确站队 {{user}}）与**亲情/义亲目标** → 走亲密开局分流（见下方「对象已站队→亲密开局分流」条款），该目标不进入雄竞期；**自由身目标**按雄竞竞争，黄毛与 {{user}} 正面竞争该对象。'],
  ['16', 1, '**亲情/义亲目标计入亲密开局分流**'],
  ['17', 1, '是否**已走亲密开局分流**（不进入雄竞期、线状态=NTRS期·亲密开局、黄毛积极行动门满足即 act）？'],
  ['18a', 6, '雄竞期/NTRS期/NTRS期·亲密开局/黄毛胜·终局'],
  ['18b', 1, '> - **NTRS期·亲密开局**：目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队/血亲义亲）'],
  ['18c', 1, '四种线状态'],
  ['19', 1, '没有则写「首轮基线」——黄毛败路径=察觉型 41% 起步；NTRS期·亲密开局路径=忠诚（低接受度完整五阶段起步）'],
  ['20a', 1, '推波助澜位置（仅 NTRS期）:** 暗中（亲密开局起步）/ 半明示 / 已默契'],
  ['20b', 1, '推波助澜姿态: 暗中（亲密开局起步）/ 半明示/已默契'],
  ['20c', 1, 'NTRS期：「暗中→半明示→默契」演进中的位置——暗中（亲密开局起步）/半明示/已默契'],
  ['20d', 1, '当前在哪（暗中/半明示/已默契——亲密开局自暗中起步）'],
  ['21', 1, '**当前阶段（NTRS期）:** [忠诚型/动摇型/察觉型/默契型/乐享型] [当前阶段]（黄毛败路径从察觉型 41% 起步；NTRS期·亲密开局路径从忠诚/动摇起步；仅 NTRS期对象填）'],
  ['22', 1, '）；NTRS期·亲密开局→亲密开局戏（对象出场即与 {{user}} 亲密——接受程度从低接受度完整五阶段起步、推波从暗中起步，其余按 NTRS期规则：门槛表/知情度三档/察觉型起📹/+0~5%/轮）'],
  ['23', 2, '📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标（NTRS期·亲密开局同此门槛：察觉型起方可📹，忠诚/动摇期一律 🌙），未入 NTRS期一律 🌙 完全不知——此为场景外行动特例；非场景外的幕后互动仍按知情度三档'],
  ['24', 1, '对象与 {{user}} 是泛泛/熟人/朋友/暧昧（自由身）不影响黄毛刷新与行动判定；已站队（恋人/配偶/血亲义亲）目标走亲密开局分流'],
  ['25', 1, '**对象情感倾向影响雄竞难度（仅自由身目标）**'],
  ['26', 1, '**本版淫妻线从察觉型（41%）起步（黄毛败转 NTRS期路径）**'],
  ['29', 1, '5. **不可避XP 驱动的期待感（仅 NTRS期）**'],
];
let allNewOk = true;
for (const [item, exp, needle] of NEW) {
  const c = count(needle);
  const ok = c === exp;
  if (!ok) allNewOk = false;
  console.log(`NEW[${item}] count=${c} expected=${exp} ${ok ? 'OK' : 'FAIL'}`);
}

const OLD = [
  ['1', '接下来的场景中该黄毛是否有出现的可能'],
  ['9', '👁️ **明面竞争**：'],
  ['15', '即使对象已站队'],
  ['16', '亲情/义亲目标不豁免'],
  ['17', '仍按雄竞判定未豁免'],
  ['18a', '雄竞期/NTRS期/黄毛胜·终局'],
  ['18b', '不抗拒黄毛互动）。\n> - **黄毛胜·终局**'],
  ['18c', '三种线状态'],
  ['19', '首轮基线=察觉型 41%'],
  ['20a', '推波助澜位置（仅 NTRS期）:** 半明示 / 已默契'],
  ['20b', '推波助澜姿态: 半明示/已默契'],
  ['20c', '「半明示→默契」演进中的位置——半明示/已默契'],
  ['20d', '当前在哪（半明示/已默契）'],
  ['21', '本版从察觉型 41% 起步，忠诚/动摇型不出现'],
  ['22', '—placeholder—'],
  ['24', '是恋人/配偶/暧昧/朋友/陌生人/已站队'],
  ['25', '已是恋人/配偶、或 {{user}} 深爱'],
  ['26', '（41%）起步**：user自始至终'],
  ['29', '不可避的XP'],
];
let allOldOk = true;
for (const [item, needle] of OLD) {
  if (needle === '—placeholder—') continue;
  const c = count(needle);
  const ok = c === 0;
  if (!ok) allOldOk = false;
  console.log(`OLD[${item}] residual count=${c} ${ok ? 'GONE' : 'STILL PRESENT'}`);
}
// item 22 old is a prefix of new (append-type) — assert new present twice-checked; old contains string check instead
const c22old = count('NTRS期→淫妻戏（照淫妻线身体接受度门槛表判定本轮身体接触上限，按黄毛五型手段施展，保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进）');
console.log('ITEM22 old-prefix now occurs ' + c22old + ' (expected 1 — kept as prefix of appended new text)');

console.log('allNewOk=' + allNewOk + ' allOldOk=' + allOldOk);
