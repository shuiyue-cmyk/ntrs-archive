// Apply PART B (B1-B6) of fix_spec_r10.md to Cirno_BATTLE_Turn_FT_NTRS.json
// In-place edit on parsed JSON object; JSON.stringify(j, null, 2) write-back.
// Dry-run with: node apply_B_NTRS_FT.js --dry
const fs = require('fs');

const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const DRY = process.argv.includes('--dry');

let raw = fs.readFileSync(PATH, 'utf8');
let bom = false;
if (raw.charCodeAt(0) === 0xfeff) { bom = true; raw = raw.slice(1); }

const j = JSON.parse(raw);
if (!Array.isArray(j)) throw new Error('top-level is NOT an array');

// ---------------- OLD / NEW pairs (verbatim from fix_spec_r10.md PART B) ----------------

const B1_OLD = '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。';
const B1_NEW = '- **对象已站队→亲密开局分流（替代雄竞竞争）**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，该目标**不进入雄竞期**——刷新黄毛锁定后线状态直接=NTRS期·亲密开局，黄毛积极行动门（对象与 {{user}} 亲密即激活）满足即 act，按 NTRS推进逻辑推进（见 B2）。\n- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步（区别于黄毛败转 NTRS期的 41% 察觉型起步）；推波助澜从暗中起步；📹 事后知情从察觉型起（忠诚/动摇期一律 🌙）。';

const B2_OLD = '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。';
const B2_NEW = B2_OLD + '\n【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态——目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队）→ 走亲密开局分流：刷新黄毛锁定后线状态直接=NTRS期·亲密开局（接受程度从低接受度五阶段起步），不经过雄竞期，黄毛积极行动门满足即 act；目标未与 {{user}} 亲密 → 照常进入雄竞期。';

const B3_OLD = '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争';
const B3_NEW = '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）；对象已站队（出场即恋人/配偶/已明确站队）→ 亲密开局分流——刷新锁定后直接 NTRS期·亲密开局（接受程度从低接受度五阶段起步、黄毛积极行动门满足即 act），不经过雄竞期';

const B4a_OLD = '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。';
const B4a_NEW = B4a_OLD + '\n- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**：不走雄竞期，直接进入 NTRS 线——对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步、推波助澜从暗中起步，随接受程度逐阶段演进；对象察觉后迎合（察觉型起），口述报告/视频=兴奋源（📹 事后知情从察觉型起，忠诚/动摇期一律 🌙）；区别于黄毛败转 NTRS期（41% 察觉型起步）。';

const B4b_OLD = '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**';
const B4b_NEW = B4b_OLD + '\n**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**对象出场即与 {{user}} 已是恋人/配偶/已站队——本路径跳过雄竞期直接进入 NTRS 线：对象接受程度五阶段从忠诚/动摇起步，黄毛行动=对亲密对象的暧昧/渗透（按黄毛五型手段），user 有 NTRS 癖好、推波助澜从暗中起步（暗中安排机会/创造独处/制造巧合，对象未察觉），接受程度升入察觉型后对象察觉迎合、推波转半明示（放行/默契），口述报告/录像=兴奋源（📹 事后知情从察觉型起）；接受程度进度按触发事件分量 +0~5%/轮推进（同 NTRS期规则）。';

const B5_OLD = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度';
const B5_NEW = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局，接受程度从低接受度五阶段起步、推波从暗中起步、察觉型起📹事后知情）';

const B6_OLD = '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。';
const B6_NEW = '3. **进度一致（仅 NTRS期适用，含亲密开局）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。';

const REPS = [
  { name: 'B1', old: B1_OLD, new: B1_NEW },
  { name: 'B2', old: B2_OLD, new: B2_NEW },
  { name: 'B3', old: B3_OLD, new: B3_NEW },
  { name: 'B4a', old: B4a_OLD, new: B4a_NEW },
  { name: 'B4b', old: B4b_OLD, new: B4b_NEW },
  { name: 'B5', old: B5_OLD, new: B5_NEW },
  { name: 'B6', old: B6_OLD, new: B6_NEW },
];

// Walk the parsed object, locate every occurrence of each OLD string (with path).
function collectPaths(rootObj) {
  const hits = new Map(); // repName -> array of {task, msg, field}
  const walk = (node, pathArr) => {
    if (typeof node === 'string') {
      for (const rep of REPS) {
        if (node.includes(rep.old)) {
          if (!hits.has(rep.name)) hits.set(rep.name, []);
          hits.get(rep.name).push(pathArr.join(' > ') + ' (len=' + node.length + ')');
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, pathArr.concat('[' + i + ']')));
    } else if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) walk(node[k], pathArr.concat(k));
    }
  };
  walk(rootObj, ['j']);
  return hits;
}

// Apply: in-place on the parsed object (keep j reference).
function applyReps(rootObj) {
  let applied = 0;
  const walk = (node) => {
    if (typeof node === 'string') {
      for (const rep of REPS) {
        if (node.includes(rep.old)) {
          node = node.split(rep.old).join(rep.new);
          applied++;
        }
      }
      return node;
    }
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) node[k] = walk(node[k]);
      return node;
    }
    return node;
  };
  walk(rootObj);
  return applied;
}

// -------- report path locations in human terms (plotTask id + promptGroup index + field) --------
function humanPath(p) {
  return p.replace('j[0].plotTasks', 'plotTasks')
    .replace('j[0]', 'root');
}

const before = collectPaths(j);
console.log('=== ANCHOR LOCATIONS (before edit) ===');
for (const rep of REPS) {
  const locs = before.get(rep.name) || [];
  console.log(rep.name + ': ' + locs.length + ' hit(s)');
  for (const l of locs) console.log('   @ ' + humanPath(l));
}
const MISSING = REPS.filter(r => !before.has(r.name) || before.get(r.name).length === 0);
console.log('=== MISSING ANCHORS: ' + (MISSING.length ? MISSING.map(m => m.name).join(', ') : 'none') + ' ===');

if (DRY || MISSING.length > 0) {
  if (MISSING.length > 0) {
    console.log('DRY-ABORT: missing anchors, NOT writing.');
  } else {
    console.log('DRY-RUN: all anchors present, not writing.');
  }
  process.exit(MISSING.length > 0 ? 2 : 0);
}

const appliedCount = applyReps(j);
console.log('=== applied replacements: ' + appliedCount + ' ===');

const out = (bom ? '\ufeff' : '') + JSON.stringify(j, null, 2);
if (!out.trimStart().startsWith('[')) throw new Error('VERIFY FAIL: output does not start with [');
fs.writeFileSync(PATH, out, 'utf8');
console.log('=== WRITTEN === top-level starts with [ : ' + out.trimStart().startsWith('['));

// ---- re-read verification ----
const raw2 = fs.readFileSync(PATH, 'utf8');
const j2 = JSON.parse(raw2.replace(/^\ufeff/, ''));
console.log('re-read JSON.parse: OK, isArray: ' + Array.isArray(j2));
console.log('re-read starts with [ : ' + raw2.trimStart().startsWith('['));
const blob = JSON.stringify(j2);
for (const rep of REPS) {
  console.log(rep.name + ' -> OLD still present: ' + blob.includes(rep.old) + ' | NEW present: ' + blob.includes(rep.new));
}
console.log('「对象已站队不豁免」literal still present: ' + blob.includes('对象已站队不豁免'));
console.log('性别类型硬约束 still present: ' + blob.includes('性别类型硬约束：spawn 时性别类型必须是 伪娘 / 药娘 / 假小子 之一'));
