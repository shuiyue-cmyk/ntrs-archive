const fs = require('fs');
const path = process.argv[2];
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);           // keep original parsed reference (top-level array)
const obj = Array.isArray(j) ? j[0] : j;
const task1 = obj.plotTasks[1];      // 黄毛判定
const task3 = obj.plotTasks[2];      // 导演台本

const report = [];
function count(needle, hay) { return hay.split(needle).length - 1; }
function assertUnique(needle, hay, label) {
  const n = count(needle, hay);
  if (n !== 1) throw new Error(label + ': expected exactly 1 occurrence, got ' + n);
}

// ---------- B1: S2-MSG0 bullet replace (task1.promptGroup[0]) ----------
const B1_OLD = '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。';
const B1_NEW = '- **对象已站队→亲密开局分流（替代雄竞竞争）**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，该目标**不进入雄竞期**——刷新黄毛锁定后线状态直接=NTRS期·亲密开局，黄毛积极行动门（对象与 {{user}} 亲密即激活）满足即 act，按 NTRS推进逻辑推进（见 B2）。\n- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步（区别于黄毛败转 NTRS期的 41% 察觉型起步）；推波助澜从暗中起步；📹 事后知情从察觉型起（忠诚/动摇期一律 🌙）。';
const m0 = task1.promptGroup[0];
assertUnique(B1_OLD, m0.content, 'B1');
m0.content = m0.content.split(B1_OLD).join(B1_NEW);
report.push('B1 replaced in task1.promptGroup[0]');

// ---------- B2: append after 分支 B line (task1.promptGroup[4]) ----------
const B2_OLD = '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。';
const B2_NEW = '【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态——目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队）→ 走亲密开局分流：刷新黄毛锁定后线状态直接=NTRS期·亲密开局（接受程度从低接受度五阶段起步），不经过雄竞期，黄毛积极行动门满足即 act；目标未与 {{user}} 亲密 → 照常进入雄竞期。';
const m4 = task1.promptGroup[4];
assertUnique(B2_OLD, m4.content, 'B2');
m4.content = m4.content.split(B2_OLD).join(B2_OLD + '\n' + B2_NEW);
report.push('B2 appended after 分支 B in task1.promptGroup[4]');

// ---------- B3: S2 description replace (task1.description) ----------
const B3_OLD = '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争';
const B3_NEW = '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）；对象已站队（出场即恋人/配偶/已明确站队）→ 亲密开局分流——刷新锁定后直接 NTRS期·亲密开局（接受程度从低接受度五阶段起步、黄毛积极行动门满足即 act），不经过雄竞期';
assertUnique(B3_OLD, task1.description, 'B3');
task1.description = task1.description.split(B3_OLD).join(B3_NEW);
report.push('B3 replaced in task1.description (S2 desc)');

// ---------- B4a: append after NTRS期 bullet (task3.promptGroup[2]) ----------
const B4a_OLD = '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。';
const B4a_NEW = '- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**：不走雄竞期，直接进入 NTRS 线——对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步、推波助澜从暗中起步，随接受程度逐阶段演进；对象察觉后迎合（察觉型起），口述报告/视频=兴奋源（📹 事后知情从察觉型起，忠诚/动摇期一律 🌙）；区别于黄毛败转 NTRS期（41% 察觉型起步）。';
const s3 = task3.promptGroup[2];
assertUnique(B4a_OLD, s3.content, 'B4a');
s3.content = s3.content.split(B4a_OLD).join(B4a_OLD + '\n' + B4a_NEW);
report.push('B4a appended after NTRS期 bullet in task3.promptGroup[2]');

// ---------- B4b: append after NTRS期编排 header (task3.promptGroup[2]) ----------
const B4b_OLD = '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**';
const B4b_NEW = '**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**对象出场即与 {{user}} 已是恋人/配偶/已站队——本路径跳过雄竞期直接进入 NTRS 线：对象接受程度五阶段从忠诚/动摇起步，黄毛行动=对亲密对象的暧昧/渗透（按黄毛五型手段），user 有 NTRS 癖好、推波助澜从暗中起步（暗中安排机会/创造独处/制造巧合，对象未察觉），接受程度升入察觉型后对象察觉迎合、推波转半明示（放行/默契），口述报告/录像=兴奋源（📹 事后知情从察觉型起）；接受程度进度按触发事件分量 +0~5%/轮推进（同 NTRS期规则）。';
assertUnique(B4b_OLD, s3.content, 'B4b');
s3.content = s3.content.split(B4b_OLD).join(B4b_OLD + '\n' + B4b_NEW);
report.push('B4b appended after 【NTRS期编排】 header in task3.promptGroup[2]');

// ---------- B5: S3 description replace (task3.description) ----------
const B5_OLD = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度';
const B5_NEW = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局，接受程度从低接受度五阶段起步、推波从暗中起步、察觉型起📹事后知情）';
assertUnique(B5_OLD, task3.description, 'B5');
task3.description = task3.description.split(B5_OLD).join(B5_NEW);
report.push('B5 replaced in task3.description (S3 desc)');

// ---------- B6: S3 注意力自检 item replace (task3.promptGroup[17]) ----------
const B6_OLD = '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。';
const B6_NEW = '3. **进度一致（仅 NTRS期适用，含亲密开局）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。';
const m17 = task3.promptGroup[17];
assertUnique(B6_OLD, m17.content, 'B6');
m17.content = m17.content.split(B6_OLD).join(B6_NEW);
report.push('B6 replaced in task3.promptGroup[17] (注意力自检)');

// ---------- EXTRA: residual cross-reference cleanup (spec checklist item 4) ----------
const X_OLD = '（对象已站队不豁免，见上方）';
const X_NEW = '（对象已站队走亲密开局分流，见上方）';
assertUnique(X_OLD, m4.content, 'X-residual');
m4.content = m4.content.split(X_OLD).join(X_NEW);
report.push('EXTRA: residual cross-reference fixed in task1.promptGroup[4]');

// ---------- write back with matching indent (2-space, no trailing newline) ----------
const out = JSON.stringify(j, null, 2);
fs.writeFileSync(path, out, 'utf8');
console.log(report.join('\n'));
console.log('written', out.length, 'bytes; raw starts with', JSON.stringify(out.slice(0, 2)), '; raw ends with', JSON.stringify(out.slice(-3)));
