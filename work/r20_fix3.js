// R20 修正3：NTRS12 系 S3 双引用（{{thugSpawn}}+{{NTRtrack}}）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_NTRS_turn_edit') && !f.includes('bak'));
const FROM = '你须照其编排：：\n{{thugSpawn}}';
const TO = '你须照其编排（人设见 {{thugSpawn}}，追踪见下）：：\n{{thugSpawn}}\n{{NTRtrack}}';
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  let n = 0;
  for (const m of s3.promptGroup) {
    let c = m.content || '';
    if (c.includes(FROM)) { c = c.split(FROM).join(TO); n++; }
    m.content = c;
  }
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = JSON.parse(fs.readFileSync(p, 'utf8'));
  const b3 = Array.isArray(back) ? back[0] : back;
  const s33 = (b3.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  const has = JSON.stringify(s33.promptGroup).includes('{{NTRtrack}}');
  const ok = n > 0 && has;
  console.log(fn + ' | 改=' + n + ' S3含NTRtrack=' + has + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
