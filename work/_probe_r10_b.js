// Probe: locate B1-B6 anchors in Cirno_BATTLE_Turn_straight_NTRS.json (R9-final state)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
console.log('top-level array:', Array.isArray(j), '| first char:', raw.trim()[0]);

const anchors = {
  B1: '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。',
  B2: '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。',
  B3: '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争',
  B4a: '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。',
  B4b: '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**',
  B5: 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度',
  B6: '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。',
};

// gather all string leaves for searching (content + description)
function collectStrings(obj, out) {
  if (typeof obj === 'string') { out.push(obj); return; }
  if (Array.isArray(obj)) { for (const v of obj) collectStrings(v, out); return; }
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) collectStrings(obj[k], out); }
}

const strs = [];
collectStrings(j, strs);

for (const [name, anchor] of Object.entries(anchors)) {
  const hits = strs.filter(s => s.includes(anchor)).length;
  console.log(`--- ${name}: hits=${hits}`);
  if (hits === 0) {
    // dump nearest region: find partial match
    const frag = anchor.slice(0, 20);
    for (let i = 0; i < strs.length; i++) {
      const idx = strs[i].indexOf(frag);
      if (idx >= 0) {
        console.log('  partial region in str[' + i + '] len=' + strs[i].length + ':');
        console.log('  ' + JSON.stringify(strs[i].slice(Math.max(0, idx - 10), idx + 200)));
        break;
      }
    }
  }
}

// Also check: 对象已站队不豁免 occurrences anywhere (should be 1 for the bullet; note B3 fragment has 对象已站队也不豁免)
console.log('--- residual check: bullet 对象已站队不豁免 exact **对象已站队不豁免** count:',
  strs.filter(s => s.includes('**对象已站队不豁免**')).length);
