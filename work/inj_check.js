// 模拟数据库 8.9 的 NameMapper 解析 + hydrate 列匹配，核对三表注入能否工作
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
// 复刻 8.9 parseDDLChineseName
const parseDDLChineseName = (ddl) => {
  if (!ddl) return null;
  const firstLine = ddl.split('\n')[0];
  const match = firstLine.match(/--\s*(.+?)\s*$/);
  return match ? match[1].trim() : null;
};
// 复刻 8.9 parseDDLColumnComments（简化：逐行找 -- 注释，关联列名）
const parseDDLColumnComments = (ddl) => {
  const map = {};
  for (const line of ddl.split('\n')) {
    const m = line.match(/^\s*(\w+)\s+[^(]*--\s*(.+?)\s*$/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
};
console.log('=== 表名映射（parseDDLChineseName）===');
const tableMap = {};
for (const k of Object.keys(t)) {
  const s = t[k];
  if (!s || !s.sourceData || !s.sourceData.ddl) continue;
  const cn = parseDDLChineseName(s.sourceData.ddl);
  const tbl = (s.sourceData.ddl.match(/CREATE TABLE\s+(\w+)/) || [])[1];
  tableMap[cn] = tbl;
  console.log((cn ? 'OK ' : '[FAIL 无中文名] ') + (cn || '???') + ' -> ' + tbl + ' (name=' + s.name + ')');
}
console.log('\n=== 三表注入目标核对 ===');
for (const need of ['黄毛表', '重要角色表', 'NTRS备忘录']) {
  console.log(need + ': ' + (tableMap[need] ? '映射到 ' + tableMap[need] + ' ✓' : '[FAIL] 无映射!'));
}
console.log('\n=== hydrate 列匹配（header vs DDL 注释）===');
const matchesSheetHeader = (sqlName, comment, header) => {
  if (!header) return false;
  return header === sqlName || (sqlName === 'row_id' && header === '行号') || header === comment;
};
for (const k of Object.keys(t)) {
  const s = t[k];
  if (!s || !s.sourceData || !s.content || !s.content[0]) continue;
  const cols = parseDDLColumnComments(s.sourceData.ddl);
  const headers = s.content[0];
  let bad = [];
  for (let i = 0; i < headers.length; i++) {
    // 按顺序找对应列
    const colLines = s.sourceData.ddl.split('\n').filter(l => /^\s*\w+\s/.test(l) && !l.includes('CREATE'));
    if (i < colLines.length) {
      const m = colLines[i].match(/^\s*(\w+)/);
      const sqlName = m ? m[1] : '';
      const comment = cols[sqlName] || '';
      if (!matchesSheetHeader(sqlName, comment, headers[i])) bad.push('#' + i + ' ' + headers[i] + ' vs ' + sqlName + '(' + comment + ')');
    } else if (headers[i] !== '') bad.push('#' + i + ' ' + headers[i] + ' 超出列数');
  }
  console.log((bad.length ? '[FAIL] ' : 'OK ') + k + ' (' + s.name + '): ' + (bad.length ? bad.join('; ') : headers.length + ' 列全匹配'));
}
