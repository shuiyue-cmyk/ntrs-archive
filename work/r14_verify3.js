// R14 OBS 全修独立验证
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.log('[FAIL] JSON ' + fn); fail++; continue; }
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const blob = JSON.stringify(j);
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const is2 = fn.endsWith('_2ALL.json');
  const isB2 = fn.startsWith('Cirno_BATTLE_Turn') && is2;
  const f1 = isN ? blob.includes('thugSpawn 内附【对象动向追踪】行') : true;
  const f2 = isN ? blob.includes('每个离场的已登场💔对象动向') : true;
  const f3 = is2 ? blob.includes('每轮所有骚扰者合计仍按 +0~5%/轮封顶') : true;
  const f5 = is2 ? blob.includes('人尽可夫') && blob.includes('骚扰者"等系统术语') : true;
  const f6 = is2 ? blob.includes('人尽可夫补充细则') : true;
  const f4 = isB2 ? blob.includes('含 NTRS期·亲密开局路径') : true;
  const ok = f1 && f2 && f3 && f5 && f6 && f4;
  console.log(fn + ': F1=' + f1 + ' F2=' + f2 + ' F3=' + f3 + ' F5=' + f5 + ' F6=' + f6 + ' F4a=' + f4 + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL PASS' : fail + ' FAIL');
process.exit(fail === 0 ? 0 : 1);
