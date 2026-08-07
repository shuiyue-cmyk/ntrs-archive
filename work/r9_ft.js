// R9 fix for Cirno_BATTLE_Turn_FT.json — PART A items (pure-rivalry FT variant)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';

const raw = fs.readFileSync(path, 'utf8');
if (!raw.trim().startsWith('[')) throw new Error('top level is not an array');
const j = JSON.parse(raw);
if (!Array.isArray(j)) throw new Error('top level not array');
const p = j[0];

// [old, new] pairs — OLD verified byte-for-byte against current file
const pairs = [
  {
    tag: 'A1',
    old: `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）`,
    nw: `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn**，不空刷新）`,
  },
  {
    tag: 'A2_FT',
    old: ` * 线状态=黄毛胜·终局 → 线已闭合，黄毛不再行动判定（no-act）`,
    nw: ` * 线状态=黄毛胜·终局 → 线锁定非闭合，黄毛仍按追踪判定互动（夫妻级亲密戏可持续，no-act 仅逻辑门不过时）`,
  },
  {
    tag: 'A8',
    old: `黄毛胜·终局落实对象线闭合场景`,
    nw: `黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续）`,
  },
  {
    tag: 'A12',
    old: `**男娘系黄毛败·友好（天意待触发）不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，按在场处理（spawn）并供 S3 推进投怀戏**`,
    nw: `**男娘系黄毛败·友好（天意待触发）单列**：黄毛以朋友身份与对象相处并酝酿对 {{user}} 的爱意——**一律按在场（spawn）处理**（不受画面分级限制，投怀戏在 {{user}} 在场轮编排；若黄毛与对象均离场则走场景外流程），供 S3 推进投怀戏`,
  },
  {
    tag: 'A13',
    old: `黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）按剧情自然，不作竞争角色登场（男娘系黄毛须留在名单中供投怀戏编排）。`,
    nw: `黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）；**男娘系（天意待触发）必须写入名单供投怀戏编排，禁止淡出**；正常男性/其他败·友好黄毛按剧情自然可淡出。`,
  },
  {
    tag: 'A14',
    old: `黄毛败·友好的后续轮回归 no-act（线闭合）；黄毛胜·终局的后续轮不回归 no-act——黄毛仍按追踪判定互动。`,
    nw: `**黄毛败·友好（男娘系天意待触发）后续轮继续判 act 推投怀戏**，翻为后宫线后转规则2 后宫互动判定；**黄毛败·友好的正常男性后续轮回归 no-act（线闭合）**；黄毛胜·终局的后续轮不回归 no-act——黄毛仍按追踪判定互动。`,
  },
  {
    tag: 'A15',
    old: `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
    nw: `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知——📹 事后知情=事后得知，🌙=事后也不知情）`,
  },
  {
    tag: 'A16',
    old: `黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（标注"竞争者·[五型]·雄竞期"）。`,
    nw: `黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（名单标注为内部调度，以剧情语言写"追求者/情敌·[外貌气质]"，prologue 正文不得出现"竞争者/雄竞期/五型"等系统术语）。`,
  },
  {
    tag: 'A17',
    old: `no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
    nw: `no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进；**若场上存在已闭合（黄毛败·友好）对象，快速通道 prologue 附一行该对象的日常互动（朋友级）；若场上存在后宫线对象则附一行后宫互动**）。`,
  },
];

// Collect all string fields that hold prompt text, in place
const fields = [];
fields.push({ loc: 'FSD', ref: () => p.finalSystemDirective, set: (v) => { p.finalSystemDirective = v; } });
for (const t of (p.plotTasks || [])) {
  fields.push({ loc: `desc:${t.id}`, ref: () => t.description, set: (v) => { t.description = v; } });
  (t.promptGroup || []).forEach((m, i) => {
    fields.push({ loc: `${t.id}[${i}]:${m.role}`, ref: () => m.content, set: (v) => { m.content = v; } });
  });
}

let totalChanged = 0;
for (const pair of pairs) {
  let hits = 0;
  for (const f of fields) {
    const val = f.ref();
    if (typeof val === 'string' && val.includes(pair.old)) {
      const n = val.split(pair.old).length - 1;
      hits += n;
      f.set(val.split(pair.old).join(pair.nw));
    }
  }
  totalChanged += hits;
  console.log(`[${pair.tag}] hits=${hits} ${hits > 0 ? 'OK' : '0-hit'}`);
}

// verify round
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // throws if invalid
console.log('total replacements applied:', totalChanged);
console.log('top-level array preserved:', out.trim().startsWith('['));
fs.writeFileSync(path, out, 'utf8');
console.log('written.');
