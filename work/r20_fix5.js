// R20 FSD 调整：{{NTRtrack}} 插在 {{thugAction}} 与 {{prologue}} 中间
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const FROM = '{{thugAction}}\n\n{{prologue}}';
const TO = '{{thugAction}}\n\n{{NTRtrack}}\n\n{{prologue}}';
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  let fsd = root.finalSystemDirective || '';
  if (!fsd.includes(FROM)) { console.log('[FAIL] FSD anchor ' + fn); fail++; continue; }
  if (fsd.includes('{{NTRtrack}}')) { console.log(fn + ': 已含 NTRtrack，跳过'); continue; }
  root.finalSystemDirective = fsd.split(FROM).join(TO);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': FSD 插入 NTRtrack OK');
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
