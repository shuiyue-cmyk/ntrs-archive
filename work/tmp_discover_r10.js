const fs = require('fs');
const path = process.argv[2];
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const obj = Array.isArray(j) ? j[0] : j;

const anchors = {
  B1: '- **对象已站队不豁免**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，黄毛刷新、行动、竞争成功的判定照常执行，不降级、不豁免——雄竞可能拆散既定关系。',
  B2: '【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。',
  B3: '黄毛出手不依赖 {{user}}-对象亲密关系（对象已站队也不豁免）：只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争',
  B4a: '- **NTRS期**：黄毛败（综合判断女主行为已选择 {{user}}——对两人的态度/行为/话语倾向 {{user}}）——{{user}} 赢得对象，**NTRS癖好从隐秘转为显性**——user不再隐藏XP，推波助澜从半明示起步；原 NTRS 核心逻辑全面适用（推波助澜、淫妻线五阶段、身体接受度门槛表、知情度三档、黄毛真情约束）。',
  B4b: '**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**',
  B5: 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度',
  B6: '3. **进度一致（仅 NTRS期适用）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用。',
};

function walkStrings(node, pathStr, hits) {
  if (typeof node === 'string') {
    for (const [k, a] of Object.entries(anchors)) {
      if (node.includes(a)) {
        hits.push({ key: k, loc: pathStr, found: true });
      }
    }
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walkStrings(v, pathStr + '[' + i + ']', hits));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      walkStrings(v, pathStr + '.' + k, hits);
    }
  }
}

const hits = [];
walkStrings(j, 'j', hits);
const found = new Set(hits.map(h => h.key));
console.log('--- FOUND ---');
for (const h of hits) console.log(h.key, '@', h.loc);
console.log('--- MISSING (spec anchor not found verbatim anywhere) ---');
for (const k of Object.keys(anchors)) {
  if (!found.has(k)) {
    console.log('MISSING:', k);
  }
}
console.log('--- CONTEXT PROBES for anchors (prefix search) ---');
// probe: find where distinctive prefixes occur, to capture actual text
const probes = {
  B1: '对象已站队不豁免',
  B2: '分支 B — 有待刷新目标',
  B3: '黄毛出手不依赖',
  B4a: 'NTRS期**',
  B4b: 'NTRS期编排',
  B5: 'NTRS期落实知情度',
  B6: '进度一致',
};
for (const [k, probe] of Object.entries(probes)) {
  let count = 0;
  walkStrings(j, 'j', []);
  const collect = [];
  walkStrings(j, 'j', []);
  (function scan(node, loc) {
    if (typeof node === 'string') {
      let idx = node.indexOf(probe);
      while (idx !== -1 && count < 3) {
        collect.push({ loc, snippet: JSON.stringify(node.slice(idx, idx + 160)) });
        count++;
        idx = node.indexOf(probe, idx + 1);
      }
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => scan(v, loc + '[' + i + ']'));
    } else if (node && typeof node === 'object') {
      for (const [kk, vv] of Object.entries(node)) scan(vv, loc + '.' + kk);
    }
  })(j, 'j');
  console.log('probe', k, '(' + probe + ') ->', count, 'hit(s)');
  for (const c of collect) console.log('  ', c.loc, c.snippet);
}
console.log('--- first char of raw ---', JSON.stringify(raw.slice(0, 2)), '| trailing:', JSON.stringify(raw.slice(-3)));
