// R9 fix: Cirno_BATTLE_Turn_straight_NTRS.json — PART A NTRS-suffix items A1/A4a/A4b/A4c/A5/A6/A7/A15
const fs = require('fs');

const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';

const pairs = [
  ['A1', `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）`,
         `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn**，不空刷新）`],
  ['A4a', `若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能`,
          `若黄毛线已收束（黄毛败转NTRS期后该线由 NTRS 判定接管）或黄毛彻底离场再无行动可能`],
  ['A4b', `仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定`,
          `仅彻底离场再无行动可能的黄毛不再列入行动判定（黄毛败转NTRS期后按 NTRS 期判定，黄毛胜·终局仍按追踪判定互动）`],
  ['A4c', `thugSpawn 线状态=黄毛胜·终局？=NTRS期/黄毛败·友好？未分胜负则雄竞期`,
          `thugSpawn 线状态=黄毛胜·终局？=NTRS期（黄毛败后转入）？未分胜负则雄竞期`],
  ['A5', `黄毛胜·终局落实对象线闭合场景`,
         `黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活）`],
  ['A6', `黄毛胜·终局：该对象线已闭合，不再推进判定）`,
         `黄毛胜·终局：该对象线锁定非闭合——胜负不再推进，但黄毛行动/互动判定照常（夫妻级亲密戏可持续））`],
  ['A7', `**线已闭合的对象（黄毛胜·终局，或已转NTRS期的对象）视为仍绑定、不参与刷新、不误判为未绑定**`,
         `**线已定对象（黄毛胜·终局，或已转NTRS期）视为仍绑定、不参与刷新、不误判为未绑定（黄毛胜·终局=线锁定非闭合，仅不再刷新新黄毛）**`],
  ['A15', `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
          `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️；📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标，未入 NTRS期一律 🌙 完全不知）`],
];

const raw0 = fs.readFileSync(FILE, 'utf8');
if (raw0.trimStart()[0] !== '[') throw new Error('raw does not start with [');
const db0 = (raw0.match(/\{\[db\./g) || []).length;
const j = JSON.parse(raw0);
if (!Array.isArray(j)) throw new Error('top-level not array');
const o = j[0];

// collect enumerated in-place fields
const fields = [];
for (const t of o.plotTasks) {
  fields.push({ label: `task[${t.name}].description`, obj: t, key: 'description' });
  t.promptGroup.forEach((g, i) => {
    fields.push({ label: `task[${t.name}].promptGroup[${i}].content`, obj: g, key: 'content' });
  });
}
fields.push({ label: 'finalSystemDirective', obj: o, key: 'finalSystemDirective' });

const preHits = {};
for (const [id, oldTxt] of pairs) preHits[id] = 0;
for (const f of fields) {
  if (typeof f.obj[f.key] !== 'string') continue;
  for (const [id, oldTxt] of pairs) {
    preHits[id] += f.obj[f.key].split(oldTxt).length - 1;
  }
}

// apply
const applied = {};
for (const [id, oldTxt, newTxt] of pairs) {
  let n = 0;
  for (const f of fields) {
    if (typeof f.obj[f.key] !== 'string') continue;
    const cur = f.obj[f.key];
    const cnt = cur.split(oldTxt).length - 1;
    if (cnt > 0) {
      f.obj[f.key] = cur.split(oldTxt).join(newTxt);
      n += cnt;
    }
  }
  applied[id] = n;
}

// residual check over whole doc
const whole = JSON.stringify(j);
const residual = {};
for (const [id, oldTxt] of pairs) residual[id] = whole.split(oldTxt).length - 1;

const db1 = (whole.match(/\{\[db\./g) || []).length;

console.log('=== pre-apply hit counts (enumerated fields) ===');
for (const [id] of pairs) console.log(`${id}: ${preHits[id]}`);
console.log('=== applied ===');
for (const [id] of pairs) console.log(`${id}: ${applied[id]}`);
console.log('=== residual OLD in final whole doc ===');
for (const [id] of pairs) console.log(`${id}: ${residual[id]}`);
console.log('{[db. baseline:', db0, ' final:', db1);

// write back only if no residual OLD and parse OK
if (Object.values(residual).some((v) => v > 0)) {
  console.log('RESIDUAL PRESENT — NOT writing back');
  process.exit(2);
}
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // safety
fs.writeFileSync(FILE, out, 'utf8');
console.log('WROTE OK, bytes:', Buffer.byteLength(out, 'utf8'));
