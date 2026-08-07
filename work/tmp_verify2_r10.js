const fs = require('fs');
const path = process.argv[2];
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const obj = j[0];

// B2 anchor uses plain quotes in the JSON string; check via parsed blob
const blob = JSON.stringify(j);
const B2_OLD = '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。';
console.log('B2_OLD still present in parsed blob (append-style):', blob.split(B2_OLD).length - 1);

// B4a/B4b anchors kept (append-style)
const B4a_OLD = '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。';
const B4b_OLD = '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**';
const B5_OLD = 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度';
console.log('B4a_OLD kept (append):', blob.split(B4a_OLD).length - 1);
console.log('B4b_OLD kept (append):', blob.split(B4b_OLD).length - 1);
console.log('B5_OLD as prefix of NEW (expected 1):', blob.split(B5_OLD).length - 1);

// NEW texts
const news = ['对象已站队→亲密开局分流（替代雄竞竞争）','亲密开局 NTRS 线起点','分支 B-亲密开局分流','自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）','NTRS期·亲密开局（对象出场即与 {{user}} 亲密）','NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）','含亲密开局路径：对象出场即与{{user}}亲密','进度一致（仅 NTRS期适用，含亲密开局）'];
for (const n of news) console.log('NEW present:', n.slice(0, 30) + '...', '->', blob.split(n).length - 1);

// residual phrase + extra fix
console.log('对象已站队不豁免 count:', blob.split('对象已站队不豁免').length - 1);
console.log('extra fix 对象已站队走亲密开局分流，见上方 present:', blob.split('对象已站队走亲密开局分流，见上方').length - 1);

// context of the fixed cross-reference line
const idx = blob.indexOf('亲密关系判定不再作为黄毛出手前提');
console.log('cross-ref line context:', JSON.stringify(blob.slice(idx, idx + 130)));

// gender constraint untouched (task_rules) - check no change
console.log('性别类型硬约束 count:', blob.split('性别类型硬约束').length - 1);

// top-level array + name + task count
console.log('top-level array:', Array.isArray(j), 'raw starts [:', raw.trimStart().startsWith('['), '| plotTasks:', obj.plotTasks.length);

// B1 anchor gone from parsed blob
const B1_OLD = '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。';
console.log('B1_OLD gone:', blob.split(B1_OLD).length - 1);
// B3/B6 gone
const B3_OLD = '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争';
const B6_OLD = '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。';
console.log('B3_OLD gone:', blob.split(B3_OLD).length - 1, '| B6_OLD gone:', blob.split(B6_OLD).length - 1);

// macro leak check
console.log('{user} single-brace:', blob.split('{user}').length - 1);
