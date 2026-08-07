const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');

const j = JSON.parse(raw);
if (!Array.isArray(j)) { console.log('FATAL: top-level not array'); process.exit(1); }

const pairs = {
  A1: [
    '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
    '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn**，不空刷新）',
  ],
  A4a: [
    '若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能',
    '若黄毛线已收束（黄毛败转NTRS期后该线由 NTRS 判定接管）或黄毛彻底离场再无行动可能',
  ],
  A4b: [
    '仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定',
    '仅彻底离场再无行动可能的黄毛不再列入行动判定（黄毛败转NTRS期后按 NTRS 期判定，黄毛胜·终局仍按追踪判定互动）',
  ],
  A5: [
    '黄毛胜·终局落实对象线闭合场景',
    '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活）',
  ],
  A6: [
    '黄毛胜·终局：该对象线已闭合，不再推进判定）',
    '黄毛胜·终局：该对象线锁定非闭合——胜负不再推进，但黄毛行动/互动判定照常（夫妻级亲密戏可持续））',
  ],
  A7: [
    '**线已闭合的对象（黄毛胜·终局，或已转NTRS期的对象）视为仍绑定、不参与刷新、不误判为未绑定**',
    '**线已定对象（黄毛胜·终局，或已转NTRS期）视为仍绑定、不参与刷新、不误判为未绑定（黄毛胜·终局=线锁定非闭合，仅不再刷新新黄毛）**',
  ],
  A15: [
    '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）',
    '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️；📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标，未入 NTRS期一律 🌙 完全不知）',
  ],
};

function applyToField(obj, key, old, next) {
  const v = obj[key];
  if (typeof v !== 'string' || !v.includes(old)) return 0;
  const n = v.split(old).length - 1;
  obj[key] = v.split(old).join(next);
  return n;
}

const hits = {};
for (const [id, [old, next]] of Object.entries(pairs)) {
  let total = 0;
  for (const t of j[0].plotTasks || []) {
    for (const m of t.promptGroup || []) total += applyToField(m, 'content', old, next);
    total += applyToField(t, 'description', old, next);
  }
  total += applyToField(j[0], 'finalSystemDirective', old, next);
  for (const m of j[0].promptGroup || []) total += applyToField(m, 'content', old, next);
  hits[id] = total;
  console.log(`${id}: hit=${total} ${total > 0 ? 'OK' : '*** 0-HIT ***'}`);
}

// write-back gate: JSON parse OK && raw starts with '['
let check;
try { check = JSON.parse(JSON.stringify(j)); } catch (e) { console.log('FATAL: post-edit JSON broken', e.message); process.exit(1); }
const out = JSON.stringify(j, null, 2);
if (!out.startsWith('[')) { console.log('FATAL: serialized top-level not array'); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
console.log('WROTE OK, bytes:', out.length);

// verify db blocks intact
const beforeDb = (raw.match(/\{\[db[^\]]*\]\}/g) || []);
const afterDb = (out.match(/\{\[db[^\]]*\]\}/g) || []);
console.log('db blocks before:', beforeDb.length, 'after:', afterDb.length, 'same:', JSON.stringify(beforeDb) === JSON.stringify(afterDb));
