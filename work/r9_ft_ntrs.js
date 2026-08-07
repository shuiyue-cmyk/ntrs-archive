// R9 PART A NTRS-suffix fixes for Cirno_BATTLE_Turn_FT_NTRS.json
// Items: A1, A4a, A4b, A5, A6, A7, A15 (NTRS variant)
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';

const pairs = [
  // A1
  ['无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
   '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn**，不空刷新）'],
  // A4a
  ['若黄毛线已闭合（黄毛败·友好）或黄毛彻底离场再无行动可能',
   '若黄毛线已收束（黄毛败转NTRS期后该线由 NTRS 判定接管）或黄毛彻底离场再无行动可能'],
  // A4b
  ['仅线闭合（黄毛败·友好/彻底离场）不再列入行动判定',
   '仅彻底离场再无行动可能的黄毛不再列入行动判定（黄毛败转NTRS期后按 NTRS 期判定，黄毛胜·终局仍按追踪判定互动）'],
  // A5
  ['黄毛胜·终局落实对象线闭合场景',
   '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活）'],
  // A6
  ['黄毛胜·终局：该对象线已闭合，不再推进判定）',
   '黄毛胜·终局：该对象线锁定非闭合——胜负不再推进，但黄毛行动/互动判定照常（夫妻级亲密戏可持续））'],
  // A7
  ['**线已闭合的对象（黄毛胜·终局，或已转NTRS期的对象）视为仍绑定、不参与刷新、不误判为未绑定**',
   '**线已定对象（黄毛胜·终局，或已转NTRS期）视为仍绑定、不参与刷新、不误判为未绑定（黄毛胜·终局=线锁定非闭合，仅不再刷新新黄毛）**'],
  // A15 (NTRS variant)
  ['（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）',
   '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️；📹 事后知情仅限已入 NTRS期（41% 察觉型起）的目标，未入 NTRS期一律 🌙 完全不知）'],
];

const raw = fs.readFileSync(target, 'utf8');
if (!raw.trim().startsWith('[')) throw new Error('top-level not array, abort');
const j = JSON.parse(raw);
const o = j[0];

// collect {obj, key} references to mutate in place
const refs = [];
o.plotTasks.forEach((t) => {
  if (typeof t.description === 'string') refs.push({ obj: t, key: 'description' });
  t.promptGroup.forEach((msg) => { if (typeof msg.content === 'string') refs.push({ obj: msg, key: 'content' }); });
});
refs.push({ obj: o, key: 'finalSystemDirective' });

const names = ['A1', 'A4a', 'A4b', 'A5', 'A6', 'A7', 'A15'];
let total = 0;
for (let i = 0; i < pairs.length; i++) {
  const [oldStr, newStr] = pairs[i];
  let hits = 0;
  for (const ref of refs) {
    const cur = ref.obj[ref.key];
    const n = cur.split(oldStr).length - 1;
    if (n > 0) {
      hits += n;
      ref.obj[ref.key] = cur.split(oldStr).join(newStr);
    }
  }
  console.log(names[i] + ': hits=' + hits + ' ' + (hits > 0 ? 'OK' : 'MISS'));
  total += hits;
}

// sanity: all refs updated
const blob = JSON.stringify(j);
let miss = 0;
for (const [oldStr] of pairs) if (blob.includes(oldStr)) miss++;
const ok = JSON.parse(blob) && blob.trim().startsWith('[');
if (ok && miss === 0) {
  fs.writeFileSync(target, JSON.stringify(j, null, 2), 'utf8');
  console.log('WRITTEN total hits=' + total);
} else {
  console.log('ABORT miss-residual=' + miss);
}
