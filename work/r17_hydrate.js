// 全表 hydrate 验证（修正解析）
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
function matchesSheetHeader(sqlName, comment, header) {
  if (!header) return false;
  return header === sqlName || (sqlName === 'row_id' && header === '行号') || header === comment;
}
let fail = 0;
for (const k of Object.keys(j)) {
  if (k === 'mate') continue;
  const s = j[k];
  const headers = s.content[0];
  const lines = s.sourceData.ddl.split('\n');
  const cols = [];
  for (const line of lines) {
    const m = line.match(/^\s*(\w+)\s+[^]*?--\s*(.+?)\s*$/);
    if (m && m[1] !== 'CREATE' && m[1] !== 'TABLE') {
      cols.push({ name: m[1], comment: m[2].trim() });
    }
  }
  if (cols.length !== headers.length) {
    console.log('[FAIL] ' + s.name + ': ddl列数=' + cols.length + ' header数=' + headers.length + ' | ddl头=' + JSON.stringify(cols.map(c => c.name).join(',')));
    fail++;
    continue;
  }
  let ok = true;
  for (let i = 0; i < headers.length; i++) {
    const c = cols[i];
    if (!matchesSheetHeader(c.name, c.comment, headers[i])) {
      console.log('[FAIL] ' + s.name + ' 列' + i + ': header=' + headers[i] + ' sql=' + c.name + ' comment=' + c.comment);
      ok = false;
    }
  }
  if (ok) console.log(s.name + ': hydrate OK (' + headers.length + ' 列)');
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL PASS' : fail + ' FAIL');
process.exit(fail === 0 ? 0 : 1);
