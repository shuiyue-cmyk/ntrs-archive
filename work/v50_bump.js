// v5.0-preview 版本 bump：带 NTRS 的 30 个文件（NTRS12 24 + BATTLE_NTRS 6），纯雄竞 3 个不动
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak') && !f.includes('5.0-preview'));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let done = [], skipped = [], fail = [];
for (const fn of files) {
  const isN12 = fn.includes('NTRS_turn_edit');
  const isBN = fn.includes('BATTLE_Turn_') && fn.includes('_NTRS');
  if (!isN12 && !isBN) { skipped.push(fn); continue; } // 纯雄竞不动
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  const root = Array.isArray(j) ? j[0] : j;
  const oldName = root.name;
  const newName = isN12 ? oldName.replace('_4.7', '_5.0-preview') : oldName.replace(/_(NTRS)(_2ALL)?$/, '_NTRS_5.0-preview$2');
  const newFn = isN12 ? fn.replace('_4.7', '_5.0-preview') : fn.replace(/_(NTRS)(_2ALL)?\.json$/, '_NTRS_5.0-preview$2.json');
  // 只改 name 字段（字节级，保持其余内容/缩进不动）
  const re = new RegExp('"name":\\s*"' + esc(oldName) + '"');
  if (!re.test(raw)) { fail.push(fn + ' (name 字段未匹配)'); continue; }
  const out = raw.replace(re, '"name": "' + newName + '"');
  fs.writeFileSync(dir + newFn, out, 'utf8');
  fs.unlinkSync(p);
  done.push(newFn);
  // 验证
  const v = JSON.parse(fs.readFileSync(dir + newFn, 'utf8'));
  const ok = v.name === newName && !fs.existsSync(p);
  if (!ok) fail.push(newFn + ' (验证失败)');
}
console.log('已改名 ' + done.length + '：');
for (const d of done) console.log('  ' + d);
console.log('\n未动（纯雄竞）' + skipped.length + '：');
for (const s of skipped) console.log('  ' + s);
console.log(fail.length ? '\n[FAIL] ' + fail.join(' | ') : '\nALL OK');
