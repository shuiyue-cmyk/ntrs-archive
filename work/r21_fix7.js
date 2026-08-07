// R21 补修5：revise+ALLin sparkNotes 收尾枚举补 NTRtrack（共六个标签但枚举 5 个）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_NTRS_turn_edit') && f.includes('revise') && f.includes('ALLin') && !f.includes('bak'));
const FROM = '先 <thugSpawn>+<thugSpawnReason>，再 <thugAction>+<thugActionReason>，最后 <userCalib>，共六个标签一气呵成';
const TO = '先 <thugSpawn>+<NTRtrack>（追踪）+<thugSpawnReason>，再 <thugAction>+<thugActionReason>，最后 <userCalib>，共六个标签一气呵成';
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
  const ok = n > 0;
  console.log(fn + ': 改=' + n + ' ' + (ok ? 'OK' : '[FAIL] 锚点未匹配'));
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL PASS' : fail + ' FAIL');
process.exit(fail === 0 ? 0 : 1);
