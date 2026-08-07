const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';

function findInTask(p, needle) {
  for (const t of (p.plotTasks || [])) {
    const blob = JSON.stringify(t);
    const idx = blob.indexOf(needle);
    if (idx !== -1) return { blob, idx };
  }
  return null;
}

// FT + straight: dump 8d selfcheck and item1 spawn sentence
for (const f of ['Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_straight.json']) {
  const raw = fs.readFileSync(dir + '/' + f, 'utf8');
  const p = JSON.parse(raw)[0];
  console.log(`\n########## ${f} ##########`);
  let hit = findInTask(p, '登场角色名单？');
  if (hit) {
    const i = hit.idx;
    console.log('8d region:', JSON.stringify(hit.blob.slice(i - 60, i + 120)));
  } else console.log('8d region: NOT FOUND');
  hit = findInTask(p, '本轮黄毛能否进入');
  if (hit) {
    const i = hit.idx;
    console.log('item1 applied:', JSON.stringify(hit.blob.slice(i - 60, i + 130)));
  } else {
    hit = findInTask(p, '接下来的场景中该黄毛是否有出现的可能');
    if (hit) {
      const i = hit.idx;
      console.log('item1 NOT applied:', JSON.stringify(hit.blob.slice(i - 60, i + 130)));
    } else console.log('item1: NOT FOUND at all');
  }
  // item4 applied?
  hit = findInTask(p, '本节登场角色分析');
  if (hit) console.log('item4:', JSON.stringify(hit.blob.slice(hit.idx, hit.idx + 30)));
  // item13 numbering in FT (FT has no 1b problem, but check what 黄毛胜 marker looks like)
  hit = findInTask(p, '线状态=黄毛胜·终局**的对象');
  if (hit) console.log('FT 黄毛胜 marker:', JSON.stringify(hit.blob.slice(hit.idx - 30, hit.idx + 10)));
}
