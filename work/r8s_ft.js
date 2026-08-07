// R8S fix for Cirno_BATTLE_Turn_FT.json (BATTLE FT plain)
// G1-G4: spawn 在场判定按空间性质分级（公共空间宽松 / 私密空间严格）
// Applies to promptGroup[].content, task.description, j[0].finalSystemDirective.
// Keeps original top-level array j; writes back JSON.stringify(j, null, 2) utf8.
const fs = require('fs');

const FILE = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_FT.json';

// ---- G pairs (OLD = spec canonical, verified byte-for-byte against current file) ----
const pairs = [
  {
    id: 'G1',
    old: `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
    new: `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
  },
  {
    id: 'G2',
    old: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
    new: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  },
  {
    id: 'G3',
    old: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
    new: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（公共空间宽松：同处该公共空间即视为在场；私密空间严格：须实际进入该私密空间画面）或本轮新刷新进入画面；黄毛不在 {{user}} 当前场景画面内（私密空间含同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动）=no_spawn**`,
  },
  {
    id: 'G4',
    old: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
    new: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
  },
];

// fallback anchors (spec 版本差异注意): extract OLD from file between start..end inclusive
const anchors = {
  G1: { start: `以 **{{user}} 本轮当前场景画面** 为唯一基准`, end: `与 spawn 判定无关。` },
  G2: { start: `**刷新成功判定标准 = 本轮黄毛能否进入`, end: `不空刷新**` },
  G3: { start: `**spawn=本轮黄毛在`, end: `=no_spawn**` },
  G4: { start: `- **no_spawn**：本轮无黄毛在`, end: `。两种情形：` },
};

// residual scan phrases (spec 验证要求 2)
const residuals = {
  G1: `为唯一基准——黄毛**本轮能否进入`,
  G2: `本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现`,
  G3: `黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪`,
  G4: `本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪`,
};

// ---- read ----
const raw = fs.readFileSync(FILE, 'utf8');
const hadBom = raw.charCodeAt(0) === 0xfeff;
const topArray = raw.trim().startsWith('[');
console.log('hadBOM:', hadBom);
console.log('top-level array:', topArray);

const j = JSON.parse(raw); // keep ORIGINAL top-level j

// ---- collect targets as {owner, key} refs so mutation reaches j ----
const targets = [];
const labels = [];
const collect = (preset, pi) => {
  if (!preset) return;
  if (Array.isArray(preset.plotTasks)) {
    preset.plotTasks.forEach((task, ti) => {
      if (Array.isArray(task.promptGroup)) {
        task.promptGroup.forEach((msg, mi) => {
          if (msg && typeof msg.content === 'string') {
            targets.push({ owner: msg, key: 'content' });
            labels.push(`j[${pi}].plotTasks[${ti}].promptGroup[${mi}].content`);
          }
        });
      }
      if (task && typeof task.description === 'string') {
        targets.push({ owner: task, key: 'description' });
        labels.push(`j[${pi}].plotTasks[${ti}].description`);
      }
    });
  }
  if (typeof preset.finalSystemDirective === 'string') {
    targets.push({ owner: preset, key: 'finalSystemDirective' });
    labels.push(`j[${pi}].finalSystemDirective`);
  } else {
    console.log(`j[${pi}].finalSystemDirective: absent (not a string)`);
  }
};
if (Array.isArray(j)) j.forEach((p, i) => collect(p, i));
else collect(j, 0);

const allText = () => targets.map((t) => t.owner[t.key]).join('\n');
const countIn = (s, sub) => (sub === '' ? 0 : s.split(sub).length - 1);

// ---- probe: canonical OLD hits ----
const blob0 = allText();
for (const p of pairs) {
  const c = countIn(blob0, p.old);
  console.log(`${p.id} canonical-OLD hit count: ${c}`);
}

// ---- fallback extraction for 0-hit pairs ----
for (const p of pairs) {
  if (countIn(blob0, p.old) > 0) continue;
  let extracted = null;
  for (const t of targets) {
    const s = t.owner[t.key];
    const si = s.indexOf(anchors[p.id].start);
    if (si === -1) continue;
    const ei = s.indexOf(anchors[p.id].end, si);
    if (ei === -1) continue;
    extracted = s.slice(si, ei + anchors[p.id].end.length);
    break;
  }
  if (extracted) {
    console.log(`${p.id}: canonical OLD not found, extracted from file (len ${extracted.length})`);
    p.old = extracted; // use actual file text
  } else {
    console.log(`${p.id}: canonical OLD not found AND anchor extraction failed -> 0-hit`);
  }
}

// ---- apply to real objects (split/join, never regex) ----
const applied = {};
for (const p of pairs) {
  applied[p.id] = 0;
  for (const t of targets) {
    const v = t.owner[t.key];
    if (typeof v === 'string' && v.includes(p.old) && p.old.length > 0) {
      applied[p.id] += v.split(p.old).length - 1;
      t.owner[t.key] = v.split(p.old).join(p.new);
    }
  }
}
console.log('applied counts:', JSON.stringify(applied));

// ---- write back only if parse OK and top-level array ----
let wrote = false;
try {
  const out = JSON.stringify(j, null, 2);
  JSON.parse(out);
  if (!topArray) {
    console.log('ABORT: top-level not array, NOT writing');
  } else {
    fs.writeFileSync(FILE, (hadBom ? '\uFEFF' : '') + out, 'utf8');
    wrote = true;
    console.log('WROTE', FILE);
  }
} catch (e) {
  console.log('WRITE ABORTED:', e.message);
}

// ---- verify by re-reading ----
if (wrote) {
  const raw2 = fs.readFileSync(FILE, 'utf8');
  const j2 = JSON.parse(raw2);
  const blob = JSON.stringify(j2);
  console.log('--- verify ---');
  console.log('JSON.parse OK:', true);
  console.log('top-level array:', raw2.trim().startsWith('['));
  for (const p of pairs) {
    console.log(`${p.id}: residual "${residuals[p.id]}" count:`, countIn(blob, residuals[p.id]));
  }
  console.log('公共空间宽松 present:', blob.includes('公共空间宽松'));
  console.log('私密空间严格 present:', blob.includes('私密空间严格'));
  console.log('宽松判定 present:', blob.includes('宽松判定'), '| 严格判定 present:', blob.includes('严格判定'));
  console.log('exact 公共空间宽松判定:', blob.includes('公共空间宽松判定'), '| exact 私密空间严格判定:', blob.includes('私密空间严格判定'));
}
