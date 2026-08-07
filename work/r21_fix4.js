// R21 补修2：sparkNotes 前置注漏 NTRtrack（BATTLE 系/NTRS12 非 revise）+ 分支A 表头措辞
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  let n = 0;
  for (const m of s2.promptGroup) {
    let c = m.content || '';
    // F7a. sparkNotes 前置注（非 revise 变体）：(thugSpawn→thugSpawnReason→thugAction→thugActionReason)
    if (!fn.includes('revise')) {
      const old1 = '（thugSpawn→thugSpawnReason→thugAction→thugActionReason）';
      const new1 = '（thugSpawn→NTRtrack→thugSpawnReason→thugAction→thugActionReason）';
      if (c.includes(old1)) { c = c.split(old1).join(new1); n++; }
    }
    // F8. BATTLE 分支A 表头：型体概要说明（型体概要在 NTRtrack）
    if (fn.startsWith('Cirno_BATTLE_Turn')) {
      const old2 = '但须补列型体概要供下游直读）：';
      const new2 = '追踪与型体概要等字段在 <NTRtrack> 内输出供下游直读）：';
      if (c.includes(old2)) { c = c.split(old2).join(new2); n++; }
    }
    m.content = c;
  }
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': 补修 ' + n + ' 处');
}
console.log('DONE');
