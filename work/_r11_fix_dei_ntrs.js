// R11 fix for Cirno_BATTLE_Turn_DEI_NTRS.json — items 1, 9, 15-26, 29 (27/28/30 = no edit, see report)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';

const beforeBytes = fs.statSync(path).size;
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = Array.isArray(j) ? j[0] : j;

// Content blobs = plotTasks' promptGroup only (anchors verified to live there)
const blobs = [];
(o.plotTasks || []).forEach((t, ti) => {
  (t.promptGroup || []).forEach((m, mi) => {
    blobs.push({ label: `T${ti}.pg[${mi}] ${m.role}`, content: m.content, msg: m });
  });
});

const R = [
  { item: 1,  expected: 1, old: '有没有尚无黄毛的角色，**接下来的场景中该黄毛是否有出现的可能**（有出场契机/进入画面路径/互动机会）？只是"存在"而无出场可能（同楼住户/无关联）→ 不空刷新', new: '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新' },
  { item: 9,  expected: 1, old: '👁️ **明面竞争**', new: '👁️ **明面竞争（在场见证）**' },
  { item: 15, expected: 1, old: '**雄竞核心规则（本预设核心，替代原亲密关系行动门）**：黄毛出手**不依赖** {{user}}-目标亲密关系是否建立。只要同时满足 ① 本轮出现 {{user}} 可攻略角色（💔敏感角色）② 黄毛刷新合理（时空/人设/剧情允许）③ 黄毛行动合理（逻辑无硬伤门全过）→ 黄毛即出手，与 {{user}} 正面竞争该对象。**即使对象已站队**（已是 {{user}} 的恋人/配偶/已明确站队 {{user}}）也不豁免：黄毛照样刷新、行动，且可竞争成功（挖墙脚）——雄竞不因对象已站队而终结。', new: '**雄竞核心规则（本预设核心，替代原亲密关系行动门）**：黄毛出手**不依赖** {{user}}-目标亲密关系是否建立。只要同时满足 ① 本轮出现 {{user}} 可攻略角色（💔敏感角色）② 黄毛刷新合理（时空/人设/剧情允许）③ 黄毛行动合理（逻辑无硬伤门全过）→ 黄毛即出手。**对象已站队**（恋人/配偶/已明确站队 {{user}}）与**亲情/义亲目标** → 走亲密开局分流（见下方「对象已站队→亲密开局分流」条款），该目标不进入雄竞期；**自由身目标**按雄竞竞争，黄毛与 {{user}} 正面竞争该对象。' },
  { item: 16, expected: 1, old: '**亲情/义亲目标不豁免**：目标为 {{user}} 的直系血亲/兄弟姐妹/养亲或义亲（义父/义母/义兄/义妹等）时，同样适用雄竞逻辑——黄毛照常刷新与行动，不因亲情关系豁免。', new: '**亲情/义亲目标计入亲密开局分流**：目标为 {{user}} 的直系血亲/兄弟姐妹/养亲或义亲（义父/义母/义兄/义妹等）时，其与 {{user}} 的亲情/义亲关系视为既定亲密关系——黄毛照常刷新锁定，但该目标不进入雄竞期，线状态直接=NTRS期·亲密开局（按「对象已站队→亲密开局分流」处理）。' },
  { item: 17, expected: 1, old: 'c) 已站队的对象（已是 {{user}} 恋人/配偶）是否**仍按雄竞判定未豁免**？黄毛是否照常刷新/行动？', new: 'c) 已站队的对象（已是 {{user}} 恋人/配偶/血亲义亲）是否**已走亲密开局分流**（不进入雄竞期、线状态=NTRS期·亲密开局、黄毛积极行动门满足即 act）？' },
  { item: '18a', expected: 6, old: '雄竞期/NTRS期/黄毛胜·终局', new: '雄竞期/NTRS期/NTRS期·亲密开局/黄毛胜·终局' },
  { item: '18b', expected: 1, old: '不抗拒黄毛互动）。\n> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛', new: '不抗拒黄毛互动）。\n> - **NTRS期·亲密开局**：目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队/血亲义亲）——刷新锁定后直接进入，不经过雄竞期；对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步。\n> - **黄毛胜·终局**：本轮确认黄毛胜（剧情确认：对象明确选择黄毛' },
  { item: '18c', expected: 1, old: '三种线状态', new: '四种线状态' },
  { item: 19, expected: 1, old: '没有则写「首轮基线=察觉型 41%」——本版黄毛败后淫妻线从 41% 起步', new: '没有则写「首轮基线」——黄毛败路径=察觉型 41% 起步；NTRS期·亲密开局路径=忠诚（低接受度完整五阶段起步）' },
  { item: '20a', expected: 1, old: '**{{user}} 推波助澜位置（仅 NTRS期）:** 半明示 / 已默契', new: '**{{user}} 推波助澜位置（仅 NTRS期）:** 暗中（亲密开局起步）/ 半明示 / 已默契' },
  { item: '20b', expected: 1, old: '{{user}} 推波助澜姿态: 半明示/已默契', new: '{{user}} 推波助澜姿态: 暗中（亲密开局起步）/ 半明示/已默契' },
  { item: '20c', expected: 1, old: 'NTRS期：「半明示→默契」演进中的位置——半明示/已默契', new: 'NTRS期：「暗中→半明示→默契」演进中的位置——暗中（亲密开局起步）/半明示/已默契' },
  { item: '20d', expected: 1, old: '当前在哪（半明示/已默契）', new: '当前在哪（暗中/半明示/已默契——亲密开局自暗中起步）' },
  { item: 21, expected: 1, old: '**当前阶段（NTRS期）:** [察觉型/默契型/乐享型] [当前阶段]（本版从察觉型 41% 起步，忠诚/动摇型不出现；仅 NTRS期对象填）', new: '**当前阶段（NTRS期）:** [忠诚型/动摇型/察觉型/默契型/乐享型] [当前阶段]（黄毛败路径从察觉型 41% 起步；NTRS期·亲密开局路径从忠诚/动摇起步；仅 NTRS期对象填）' },
  { item: 22, expected: 1, old: 'NTRS期→淫妻戏（照淫妻线身体接受度门槛表判定本轮身体接触上限，按黄毛五型手段施展，保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进）', new: 'NTRS期→淫妻戏（照淫妻线身体接受度门槛表判定本轮身体接触上限，按黄毛五型手段施展，保留 {{user}} 主动推波助澜层 + 淫妻线心理，淫妻线阶段按本轮触发事件分量 +0~5%/轮推进）；NTRS期·亲密开局→亲密开局戏（对象出场即与 {{user}} 亲密——接受程度从低接受度完整五阶段起步、推波从暗中起步，其余按 NTRS期规则：门槛表/知情度三档/察觉型起📹/+0~5%/轮）' },
  { item: 23, expected: 2, old: '📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标，未入 NTRS期一律 🌙 完全不知', new: '📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标（NTRS期·亲密开局同此门槛：察觉型起方可📹，忠诚/动摇期一律 🌙），未入 NTRS期一律 🌙 完全不知——此为场景外行动特例；非场景外的幕后互动仍按知情度三档' },
  { item: 24, expected: 1, old: '对象与 {{user}} 是恋人/配偶/暧昧/朋友/陌生人/已站队，都不影响黄毛刷新与行动判定（对象已站队走亲密开局分流，见上方）', new: '对象与 {{user}} 是泛泛/熟人/朋友/暧昧（自由身）不影响黄毛刷新与行动判定；已站队（恋人/配偶/血亲义亲）目标走亲密开局分流——不进入雄竞期、线状态=NTRS期·亲密开局（见上方）' },
  { item: 25, expected: 1, old: '**对象情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，黄毛需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。', new: '**对象情感倾向影响雄竞难度（仅自由身目标）**：对象对 {{user}} 有明显情感倾向（{{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，黄毛需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。（已站队/血亲义亲目标走亲密开局分流，不适用本条）' },
  { item: 26, expected: 1, old: '**本版淫妻线从察觉型（41%）起步**：user自始至终有NTRS癖好，对象在雄竞期user的追求中已隐约感知到user异于常人的占有欲', new: '**本版淫妻线从察觉型（41%）起步（黄毛败转 NTRS期路径）**：user自始至终有NTRS癖好，对象在雄竞期user的追求中已隐约感知到user异于常人的占有欲' },
  { item: 29, expected: 1, old: '5. **不可避的XP 驱动的期待感（仅 NTRS期）**', new: '5. **不可避XP 驱动的期待感（仅 NTRS期）**' },
];

let allOk = true;
for (const r of R) {
  let total = 0;
  for (const b of blobs) {
    if (typeof b.content !== 'string') continue;
    const count = b.content.split(r.old).length - 1;
    if (count > 0) {
      b.content = b.content.split(r.old).join(r.new);
      b.msg.content = b.content;
      total += count;
    }
  }
  const ok = total === r.expected;
  if (!ok) allOk = false;
  console.log(`ITEM ${r.item}: found=${total} expected=${r.expected} ${ok ? 'OK' : 'MISMATCH'}`);
  if (total === 0) {
    // dump nearest context for diagnosis
    const frag = r.old.slice(0, 10);
    for (const b of blobs) {
      const idx = b.content.indexOf(frag);
      if (idx !== -1) {
        console.log(`  [diagnose] ${b.label} frag idx=${idx}: ${JSON.stringify(b.content.slice(Math.max(0, idx - 40), idx + 60))}`);
        break;
      }
    }
  }
}

// Always write back the original parsed array (top-level must stay array)
const out = JSON.stringify(j, null, 2);
fs.writeFileSync(path, out, 'utf8');
const afterBytes = fs.statSync(path).size;
console.log('written. bytes before=' + beforeBytes + ' after=' + afterBytes + ' delta=' + (afterBytes - beforeBytes));
console.log('allOk=' + allOk);
console.log('raw starts with [ : ' + out.trim().startsWith('['));
