// Re-apply R10 PART B (B1-B6) to Cirno_BATTLE_Turn_straight_NTRS.json (restored from bak-pre-r10)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw); // top-level array; keep j reference

const B1_OLD = '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。';
const B1_NEW = '- **对象已站队→亲密开局分流（替代雄竞竞争）**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，该目标**不进入雄竞期**——刷新黄毛锁定后线状态直接=NTRS期·亲密开局，黄毛积极行动门（对象与 {{user}} 亲密即激活）满足即 act，按 NTRS推进逻辑推进（见 B2）。\n- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步（区别于黄毛败转 NTRS期的 41% 察觉型起步）；推波助澜从暗中起步；📹 事后知情从察觉型起（忠诚/动摇期一律 🌙）。';

const B2_OLD = '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。';
const B2_NEW = '【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态——目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队）→ 走亲密开局分流：刷新黄毛锁定后线状态直接=NTRS期·亲密开局（接受程度从低接受度五阶段起步），不经过雄竞期，黄毛积极行动门满足即 act；目标未与 {{user}} 亲密 → 照常进入雄竞期。';

const B3_OLD = '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争';
const B3_NEW = '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）；对象已站队（出场即恋人/配偶/已明确站队）→ 亲密开局分流——刷新锁定后直接 NTRS期·亲密开局（接受程度从低接受度五阶段起步、黄毛积极行动门满足即 act），不经过雄竞期';

const B4a_OLD = '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。';
const B4a_NEW = '- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**：不走雄竞期，直接进入 NTRS 线——对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步、推波助澜从暗中起步，随接受程度逐阶段演进；对象察觉后迎合（察觉型起），口述报告/视频=兴奋源（📹 事后知情从察觉型起，忠诚/动摇期一律 🌙）；区别于黄毛败转 NTRS期（41% 察觉型起步）。';

const B4b_OLD = '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**';
const B4b_NEW = '**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**对象出场即与 {{user}} 已是恋人/配偶/已站队——本路径跳过雄竞期直接进入 NTRS 线：对象接受程度五阶段从忠诚/动摇起步，黄毛行动=对亲密对象的暧昧/渗透（按黄毛五型手段），user 有 NTRS 癖好、推波助澜从暗中起步（暗中安排机会/创造独处/制造巧合，对象未察觉），接受程度升入察觉型后对象察觉迎合、推波转半明示（放行/默契），口述报告/录像=兴奋源（📹 事后知情从察觉型起）；接受程度进度按触发事件分量 +0~5%/轮推进（同 NTRS期规则）。';

const B5_OLD = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度';
const B5_NEW = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局，接受程度从低接受度五阶段起步、推波从暗中起步、察觉型起📹事后知情）';

const B6_OLD = '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。';
const B6_NEW = '3. **进度一致（仅 NTRS期适用，含亲密开局）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。';

// B1 companion residual (verification list item 4): task_rules cross-ref to replaced bullet
const B1C_OLD = '（对象已站队不豁免，见上方）';
const B1C_NEW = '（对象已站队走亲密开局分流，见上方）';

// ops: [name, old, new]
const ops = [
  ['B1', B1_OLD, B1_NEW],
  ['B2', B2_OLD, B2_OLD + '\n' + B2_NEW],
  ['B3', B3_OLD, B3_NEW],
  ['B4a', B4a_OLD, B4a_OLD + '\n' + B4a_NEW],
  ['B4b', B4b_OLD, B4b_OLD + '\n' + B4b_NEW],
  ['B5', B5_OLD, B5_NEW],
  ['B6', B6_OLD, B6_NEW],
  ['B1C', B1C_OLD, B1C_NEW],
];

// pre-check: every old must be found exactly once across leaves
const leaves = [];
(function c(o){ if (typeof o === 'string') { leaves.push(o); return; } if (Array.isArray(o)) { o.forEach(c); return; } if (o && typeof o === 'object') { Object.values(o).forEach(c); } })(j);
const pre = {};
for (const [name, old] of ops) {
  const n = leaves.filter(s => s.includes(old)).length;
  pre[name] = n;
  console.log(`pre ${name}: ${n}`);
}
if (Object.values(pre).some(n => n !== 1)) {
  console.error('ABORT: anchor not found exactly once');
  process.exit(1);
}

// apply in-place: mutate every string leaf, return the (possibly new) string
const applied = {};
(function w(o){
  if (typeof o === 'string') {
    let s = o;
    for (const [name, old, rep] of ops) {
      if (s.includes(old)) {
        s = s.split(old).join(rep);
        applied[name] = (applied[name] || 0) + 1;
      }
    }
    return s;
  }
  if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = w(o[i]); return o; }
  if (o && typeof o === 'object') { for (const k of Object.keys(o)) o[k] = w(o[k]); return o; }
  return o;
})(j);

console.log('applied:', JSON.stringify(applied));
fs.writeFileSync(path, JSON.stringify(j, null, 2), 'utf8');

// verify by re-read
const raw2 = fs.readFileSync(path, 'utf8');
const j2 = JSON.parse(raw2);
const blob2 = JSON.stringify(j2);
console.log('verify: parse ok | startsWith[:', raw2.trim().startsWith('['), '| array:', Array.isArray(j2), '| bytes:', Buffer.byteLength(raw2, 'utf8'));
const residuals = {
  '对象已站队不豁免': blob2.split('对象已站队不豁免').length - 1,
  '对象已站队也不豁免': blob2.split('对象已站队也不豁免').length - 1,
};
const news = {
  'B1-分流条款': blob2.split('**对象已站队→亲密开局分流（替代雄竞竞争）**').length - 1,
  'B1-起点条款': blob2.split('- **亲密开局 NTRS 线起点**：').length - 1,
  'B2-分流句': blob2.split('【分支 B-亲密开局分流】：').length - 1,
  'B3-desc': blob2.split('亲密开局分流——刷新锁定后直接 NTRS期·亲密开局').length - 1,
  'B4a-新bullet': blob2.split('**NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**').length - 1,
  'B4b-新标题': blob2.split('**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**').length - 1,
  'B5-desc': blob2.split('（含亲密开局路径：对象出场即与{{user}}亲密').length - 1,
  'B6-自检': blob2.split('3. **进度一致（仅 NTRS期适用，含亲密开局）**').length - 1,
  'B1C-残留修正': blob2.split('（对象已站队走亲密开局分流，见上方）').length - 1,
};
console.log('residuals:', JSON.stringify(residuals));
console.log('news:', JSON.stringify(news));
