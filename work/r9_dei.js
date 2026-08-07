const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) throw new Error('raw does not start with [');
const j = JSON.parse(raw); // keep ORIGINAL top-level j (array)
const p = j[0];

// [id, OLD, NEW] — OLD byte-for-byte from current file (verified by grep/ctx)
const pairs = [
  ['A1',
    '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
    '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn**，不空刷新）'],
  ['A2',
    ' * 线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合，黄毛不再行动判定',
    ' * 线状态=黄毛败·友好 → 线闭合，黄毛不再行动判定（胜负确认轮例外见触发规则）；线状态=黄毛胜·终局 → 线锁定非闭合，黄毛仍按追踪判定互动（夫妻级亲密戏可持续）'],
  ['A8',
    '黄毛胜·终局落实对象线闭合场景',
    '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续）'],
  ['A9',
    '黄毛胜/黄毛败则线闭合锁定',
    '黄毛胜则线锁定（非闭合，夫妻戏可持续）；黄毛败则线闭合（黄毛退居朋友位）'],
  ['A10',
    '黄毛胜·终局：对象嫁黄毛、线闭合',
    '黄毛胜·终局：对象嫁黄毛、**线锁定非闭合**（黄毛仍追踪、夫妻戏可持续）'],
  ['A11',
    '**正常男性则线闭合不再列出**；仅彻底离场不再列入行动判定',
    '**正常男性败·友好确认轮仍须列出**（标「黄毛败·友好」供 S3 编排友情收尾，次轮起不再列出）；仅彻底离场不再列入行动判定'],
  ['A12',
    '**男娘系黄毛败·友好（天意待触发）不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，按在场处理（spawn）并供 S3 推进投怀戏**',
    '**男娘系黄毛败·友好（天意待触发）单列**：黄毛以朋友身份与对象相处并酝酿对 {{user}} 的爱意——**一律按在场（spawn）处理**（不受画面分级限制，投怀戏在 {{user}} 在场轮编排；若黄毛与对象均离场则走场景外流程），供 S3 推进投怀戏'],
  ['A13',
    '→ 黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）或淡出——按剧情自然，不作竞争角色登场。',
    '→ 黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）；**男娘系（天意待触发）必须写入名单供投怀戏编排，禁止淡出**；正常男性/其他败·友好黄毛按剧情自然可淡出。'],
  ['A15',
    '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）',
    '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知——📹 事后知情=事后得知，🌙=事后也不知情）'],
  ['A16',
    '黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（标注"竞争者·[五型]·雄竞期"）。',
    '黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（名单标注为内部调度，以剧情语言写"追求者/情敌·[外貌气质]"，prologue 正文不得出现"竞争者/雄竞期/五型"等系统术语）。'],
  ['A17',
    'no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。',
    'no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进；**若场上存在已闭合（黄毛败·友好）对象，快速通道 prologue 附一行该对象的日常互动（朋友级）；若场上存在后宫线对象，附一行后宫互动**）。'],
];

const hits = {};
function applyInPlace(obj, key) {
  for (const [id, old, next] of pairs) {
    if (typeof obj[key] === 'string' && obj[key].includes(old)) {
      const n = obj[key].split(old).length - 1;
      hits[id] = (hits[id] || 0) + n;
      obj[key] = obj[key].split(old).join(next);
    }
  }
}

for (const t of p.plotTasks || []) {
  applyInPlace(t, 'description');
  for (const m of t.promptGroup || []) applyInPlace(m, 'content');
}
applyInPlace(p, 'finalSystemDirective');

// report hits per pair
for (const [id] of pairs) console.log(`${id}: hits=${hits[id] || 0}${hits[id] ? '' : '  <-- 0 HIT'}`);

// write back only if parse OK and raw starts with [
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // throws if invalid
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN', out.length);
