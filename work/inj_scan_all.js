// 全量扫描 30 个 NTRS 预设的 db 注入表达式 + 复刻 8.9 列注释解析
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && f.includes('5.0-preview') && !f.includes('bak'));
const exprs = new Map(); // expr -> [files]
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const blob = [];
  for (const t of root.plotTasks) for (const m of t.promptGroup) blob.push(m.content || '');
  if (root.finalSystemDirective) blob.push(root.finalSystemDirective);
  const all = blob.join('\n');
  const re = /\{\[(db\.[^\]}]+)\]\}/g;
  let m;
  while ((m = re.exec(all))) {
    const e = m[1].trim();
    if (!exprs.has(e)) exprs.set(e, []);
    if (!exprs.get(e).includes(fn)) exprs.get(e).push(fn);
  }
  // <if db= / <if cell=
  const re2 = /<if\s+(db|cell)="([^"]+)"/g;
  while ((m = re2.exec(all))) {
    const e = m[1] + ':' + m[2].trim().slice(0, 60);
    if (!exprs.has(e)) exprs.set(e, []);
    if (!exprs.get(e).includes(fn)) exprs.get(e).push(fn);
  }
}
console.log('=== 30 个预设中的 db 表达式（去重）===');
for (const [e, fns] of exprs) console.log('[' + fns.length + ' 文件] ' + e);
console.log('\n不同表达式种类: ' + exprs.size);

// 复刻 8.9 parseDDLColumnComments
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const getBody = (ddl) => { const m = ddl.match(/CREATE TABLE\s+\w+\s*\(([\s\S]*?)\)\s*;?\s*$/); return m ? m[1] : null; };
const parseCols = (ddl) => {
  const map = new Map();
  const body = getBody(ddl);
  if (body === null) return map;
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^([^\s,()]+)\s+.*?--\s*(.+?)\s*,?\s*$/);
    if (match) map.set(match[1], match[2]);
  }
  return map;
};
console.log('\n=== 3 张注入表列注释解析 ===');
for (const k of ['sheet_thug_characters', 'sheet_NcBlYRH5', 'sheet_ntrs_memo']) {
  const s = t[k];
  const cols = parseCols(s.sourceData.ddl);
  console.log('\n' + s.name + ':');
  for (const [sql, cn] of cols) console.log('  ' + sql + ' = ' + cn);
  // 检查是否有解析失败的列（DDL 里定义了但注释缺失）
  const body = getBody(s.sourceData.ddl) || '';
  const defined = body.split('\n').map(l => l.trim()).filter(l => /^\w/.test(l) && !l.startsWith('--'));
  for (const line of defined) {
    const m = line.match(/^(\w+)/);
    if (m && !cols.has(m[1])) console.log('  [!! 无注释] ' + m[1]);
  }
}
