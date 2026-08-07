const fs = require('fs');
const path = process.argv[2];
const raw = fs.readFileSync(path, 'utf8');

console.log('=== 1. JSON.parse ===');
try {
  const j = JSON.parse(raw);
  console.log('OK, top-level is array:', Array.isArray(j), '| length:', j.length);
  const obj = j[0];
  console.log('obj.name:', obj.name, '| plotTasks:', obj.plotTasks.length);
} catch (e) {
  console.log('PARSE FAILED:', e.message);
}

console.log('=== 2. raw starts with [ ===');
console.log('startsWith [ :', raw.trimStart().startsWith('['));

console.log('=== 3. B-item anchors no longer present (OLD gone) ===');
const olds = {
  B1: '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。',
  B2: '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。',
  B3: '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争',
  B4a: '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。',
  B4b: '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**',
  B5: 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度',
  B6: '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。',
};
for (const [k, v] of Object.entries(olds)) {
  const n = raw.split(v).length - 1;
  console.log(k, 'OLD gone?', n === 0, '(remaining:', n + ')');
}

console.log('=== 4. NEW texts present (each exactly once) ===');
const news = {
  B1a: '- **对象已站队→亲密开局分流（替代雄竞竞争）**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，该目标**不进入雄竞期**',
  B1b: '- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步',
  B2: '【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态',
  B3: '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）',
  B4a: '- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**：不走雄竞期，直接进入 NTRS 线',
  B4b: '**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**对象出场即与 {{user}} 已是恋人/配偶/已站队',
  B5: 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局',
  B6: '3. **进度一致（仅 NTRS期适用，含亲密开局）**：stage 里每个 X% / +X%',
};
for (const [k, v] of Object.entries(news)) {
  const n = raw.split(v).length - 1;
  console.log(k, 'present?', n >= 1, '(count:', n + ')');
}

console.log('=== 5. residual 对象已站队不豁免 ===');
const res = raw.split('对象已站队不豁免').length - 1;
console.log('对象已站队不豁免 occurrences:', res);
const res2 = raw.split('对象已站队').length - 1;
console.log('对象已站队 occurrences (context check):', res2);

console.log('=== 6. 性别类型硬约束 untouched ===');
const gen = raw.split('性别类型硬约束').length - 1;
console.log('性别类型硬约束 occurrences:', gen);
if (gen > 0) {
  const idx = raw.indexOf('性别类型硬约束');
  console.log(JSON.stringify(raw.slice(idx - 120, idx + 200)));
}

console.log('=== 7. no single-brace {user}/{char} leak ===');
console.log('{user} count:', raw.split('{user}').length - 1, '| {char} count:', raw.split('{char}').length - 1);
