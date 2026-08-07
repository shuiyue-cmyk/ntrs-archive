// R21 补修：revise 版顺序行加 NTRtrack（含 userCalib 变体）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_NTRS_turn_edit') && f.includes('revise') && !f.includes('bak'));
const FROM = 'Output tags in order: <thugSpawn>, <thugSpawnReason>, <thugAction>, <thugActionReason>, <userCalib>.';
const TO = 'Output tags in order: <thugSpawn>, <thugSpawnReason>, <NTRtrack>, <thugAction>, <thugActionReason>, <userCalib>.';
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const s2 = j[0].plotTasks.find(t => t.id === 'plotTaskThugTempo');
  let n = 0;
  for (const m of s2.promptGroup) {
    let c = m.content || '';
    if (c.includes(FROM)) { c = c.split(FROM).join(TO); n++; }
    m.content = c;
  }
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ok = JSON.stringify(back).includes('Output tags in order: <thugSpawn>, <thugSpawnReason>, <NTRtrack>, <thugAction>, <thugActionReason>, <userCalib>.');
  console.log(fn + ' | 改=' + n + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
