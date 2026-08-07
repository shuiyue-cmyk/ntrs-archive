// Precise locator for remaining enumerations + 18b insertion point
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));

function findAll(obj, needle, path, out) {
  if (typeof obj === 'string') {
    let idx = -1;
    while ((idx = obj.indexOf(needle, idx + 1)) !== -1) {
      out.push({ path, idx, ctx: obj.slice(Math.max(0, idx - 80), idx + needle.length + 80) });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => findAll(v, needle, path + `[${i}]`, out));
  } else if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) findAll(obj[k], needle, path + '.' + k, out);
  }
  return out;
}

// all bare-form occurrences
let out = [];
findAll(j, '雄竞期/NTRS期/黄毛胜·终局', 'j', out);
console.log('=== bare 雄竞期/NTRS期/黄毛胜·终局 (all) ===');
out.forEach((h, i) => console.log(`[${i + 1}] ${h.path} idx=${h.idx}\n   ctx=${JSON.stringify(h.ctx)}`));

out = [];
findAll(j, '雄竞期 / NTRS期 / 黄毛胜·终局', 'j', out);
console.log('\n=== spaced 雄竞期 / NTRS期 / 黄毛胜·终局 (all) ===');
out.forEach((h, i) => console.log(`[${i + 1}] ${h.path} idx=${h.idx}\n   ctx=${JSON.stringify(h.ctx)}`));

// colon-form variants
out = [];
findAll(j, '线状态：雄竞期', 'j', out);
findAll(j, '线状态:雄竞期', 'j', out);
console.log('\n=== 线状态：/线状态: forms ===');
out.forEach((h, i) => console.log(`[${i + 1}] ${h.path} idx=${h.idx}\n   ctx=${JSON.stringify(h.ctx)}`));

// S2MSG4 判定规则 NTRS期 bullet exact end for 18b insertion
const c4 = j[0].plotTasks[1].promptGroup[4].content;
const ntrsBulletStart = c4.indexOf('> - **NTRS期**：');
const ntrsBulletEnd = c4.indexOf('> - **黄毛胜·终局**：');
console.log('\n=== 18b NTRS期 bullet [start,end] ===');
console.log('start:', ntrsBulletStart, 'end:', ntrsBulletEnd);
console.log('bullet text:', JSON.stringify(c4.slice(ntrsBulletStart, ntrsBulletStart + 300)));
console.log('after bullet:', JSON.stringify(c4.slice(ntrsBulletEnd - 40, ntrsBulletEnd + 40)));
