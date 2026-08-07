// 版本号移到最末尾：15 个 _2ALL 文件 `_5.0-preview_2ALL` → `_2ALL_5.0-preview`（文件名 + name 字段）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak') && f.includes('5.0-preview_2ALL'));
let done = [], fail = [];
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  const root = Array.isArray(j) ? j[0] : j;
  const oldName = root.name;
  const newName = oldName.replace('_5.0-preview_2ALL', '_2ALL_5.0-preview');
  const newFn = fn.replace('_5.0-preview_2ALL', '_2ALL_5.0-preview');
  const re = new RegExp('"name":\\s*"' + esc(oldName) + '"');
  if (!re.test(raw)) { fail.push(fn + ' name 字段未匹配'); continue; }
  const out = raw.replace(re, '"name": "' + newName + '"');
  fs.writeFileSync(dir + newFn, out, 'utf8');
  fs.unlinkSync(p);
  const v = JSON.parse(fs.readFileSync(dir + newFn, 'utf8'));
  const vroot = Array.isArray(v) ? v[0] : v;
  if (vroot.name !== newName || fs.existsSync(p)) fail.push(newFn + ' 验证失败');
  done.push(newFn);
}
console.log('已调整 ' + done.length + '：');
for (const d of done) console.log('  ' + d);
console.log(fail.length ? '\n[FAIL] ' + fail.join(' | ') : '\nALL OK');
