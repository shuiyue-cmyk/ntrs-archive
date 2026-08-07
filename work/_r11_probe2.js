// Probe round 2: item20a variants, 18b NTRS期 bullet, residual 3-state enumerations
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));

function findAllInContent(taskIdx, msgIdx, needle) {
  const c = j[0].plotTasks[taskIdx].promptGroup[msgIdx].content;
  const out = [];
  let idx = -1;
  while ((idx = c.indexOf(needle, idx + 1)) !== -1) {
    out.push(idx);
  }
  return { c, out };
}

// 20a variants in stage template (task2 msg7) and everywhere
const c7 = j[0].plotTasks[2].promptGroup[7].content;
console.log('=== S3MSG7 (stage tmpl) contains 推波助澜? ===');
let i = -1; let n = 0;
while ((i = c7.indexOf('推波助澜', i + 1)) !== -1) {
  n++;
  console.log(`[${n}] idx=${i} ctx=${JSON.stringify(c7.slice(Math.max(0,i-120), i+140))}`);
}

console.log('\n=== 18b: S2MSG4 线状态判定规则 full block ===');
const c4 = j[0].plotTasks[1].promptGroup[4].content;
const rIdx = c4.indexOf('线状态判定规则');
console.log(c4.slice(rIdx - 50, rIdx + 1400));

console.log('\n=== 18a2 all （雄竞期/NTRS期/黄毛胜·终局） hits ===');
for (let t = 0; t < 3; t++) {
  const pg = j[0].plotTasks[t].promptGroup || [];
  for (let m = 0; m < pg.length; m++) {
    const { out } = findAllInContent(t, m, '（雄竞期/NTRS期/黄毛胜·终局）');
    if (out.length) console.log(`task${t} msg${m}: ${out.length} hit(s)`);
  }
}
const desc = j[0].plotTasks[2].description;
console.log('description hit:', desc.includes('（雄竞期/NTRS期/黄毛胜·终局）'));

console.log('\n=== bare 雄竞期/NTRS期/黄毛胜·终局 (no bracket) hits ===');
const blob = JSON.stringify(j);
let bi = -1; let bn = 0;
while ((bi = blob.indexOf('雄竞期/NTRS期/黄毛胜·终局', bi + 1)) !== -1) {
  bn++;
  const pre = blob.slice(Math.max(0, bi - 40), bi);
  const post = blob.slice(bi, bi + 40);
  console.log(`[${bn}] ...${JSON.stringify(pre.slice(-40))}>>>${JSON.stringify(post)}...`);
}

console.log('\n=== spaces form 雄竞期 / NTRS期 / 黄毛胜·终局 all hits ===');
let si = -1; let sn = 0;
while ((si = blob.indexOf('雄竞期 / NTRS期 / 黄毛胜·终局', si + 1)) !== -1) {
  sn++;
  const pre = blob.slice(Math.max(0, si - 60), si);
  console.log(`[${sn}] ...${JSON.stringify(pre.slice(-60))}>>> ${JSON.stringify(blob.slice(si, si + 25))} ...`);
}

console.log('\n=== NTRS期 bullet in S2MSG4 判定规则 (search 亲密开局 anywhere in task1?) ===');
const allT1 = JSON.stringify(j[0].plotTasks[1]);
console.log('task1 has 亲密开局:', allT1.includes('亲密开局'));
let k = -1; let kn = 0;
while ((k = allT1.indexOf('亲密开局', k + 1)) !== -1) {
  kn++;
  console.log(`[${kn}] ...${JSON.stringify(allT1.slice(Math.max(0,k-100), k+60))}`);
}
