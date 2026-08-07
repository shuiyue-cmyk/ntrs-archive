// R14+R13 审查：跨 33 文件一致性扫描（对象追踪措辞组内一致 / _2ALL 专属内容隔离 / 残留 / 泄漏）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
const groups = { B: [], N12: [], B2ALL: [], N122ALL: [] };
for (const fn of files) {
  if (fn.startsWith('Cirno_BATTLE_Turn') && fn.endsWith('_2ALL.json')) groups.B2ALL.push(fn);
  else if (fn.startsWith('Cirno_BATTLE_Turn')) groups.B.push(fn);
  else if (fn.endsWith('_2ALL.json')) groups.N122ALL.push(fn);
  else groups.N12.push(fn);
}
console.log('分组: B=' + groups.B.length + ' B2ALL=' + groups.B2ALL.length + ' N12=' + groups.N12.length + ' N122ALL=' + groups.N122ALL.length);
// 1. 对象追踪 S2 措辞组内一致性
const B_S2_MARK = '为场上离场的💔对象输出【对象动向追踪】';
const N_S2_MARK = 'thugSpawn 内输出【对象动向追踪】（仅离场对象）';
const B_S3_MARK = '每个离场的已登场💔对象动向';
const HAR_MARK = '乐享型·人尽可夫时，离场动向中可自然刷新临时性骚扰者';
const RK_MARK = '乐享型·人尽可夫（_2ALL 专属设定）';
for (const [g, list] of Object.entries(groups)) {
  for (const fn of list) {
    const raw = fs.readFileSync(dir + fn, 'utf8');
    const j = JSON.parse(raw);
    if (!raw.trim().startsWith('[')) { console.log('[FAIL] array ' + fn); fail++; continue; }
    const blob = JSON.stringify(j);
    const bS2 = (blob.split(B_S2_MARK).length - 1);
    const nS2 = (blob.split(N_S2_MARK).length - 1);
    const bS3 = (blob.split(B_S3_MARK).length - 1);
    const har = (blob.split(HAR_MARK).length - 1);
    const rk = (blob.split(RK_MARK).length - 1);
    const oldResid = (blob.split('同时为场上每个已登场💔对象输出一行').length - 1) + (blob.split('thugSpawn 内同时输出【对象动向追踪】').length - 1) + (blob.split('每个已登场💔对象的动向（位置+状态，一行/对象）——对象离场不静止').length - 1);
    const expect = {
      B: [bS2 === 1, bS3 === 1, har === 0, rk === 0],
      B2ALL: [bS2 === 1, bS3 === 1, har === 1, rk === 1],
      N12: [nS2 === 1, bS3 === 0, har === 0, rk === 0],
      N122ALL: [nS2 === 1, bS3 === 0, har === 1, rk === 1],
    }[g];
    const ok = expect.every(Boolean) && oldResid === 0;
    const detail = 'S2=' + (g.startsWith('B') ? bS2 : nS2) + ' S3=' + bS3 + ' 骚扰=' + har + ' 人尽可夫=' + rk + ' 旧残=' + oldResid;
    console.log(fn + ' [' + g + '] ' + detail + ' ' + (ok ? 'OK' : '[FAIL]'));
    if (!ok) fail++;
  }
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
