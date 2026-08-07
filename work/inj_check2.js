// 复刻 8.9 真实解析逻辑核对 hydrate 列匹配
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const getCreateTableDefinitionBody_ACU = (ddl) => {
  const m = ddl.match(/CREATE TABLE\s+\w+\s*\(([\s\S]*?)\)\s*;?\s*$/);
  return m ? m[1] : null;
};
const parseDDLColumnComments = (ddl) => {
  const comments = new Map();
  const body = getCreateTableDefinitionBody_ACU(ddl);
  if (body === null) return comments;
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^([^\s,()]+)\s+.*?--\s*(.+?)\s*,?\s*$/);
    if (match) comments.set(match[1], match[2]);
  }
  return comments;
};
const matchesSheetHeader = (sqlName, comment, header) => {
  if (!header) return false;
  return header === sqlName || (sqlName === 'row_id' && header === '行号') || header === comment;
};
let totalBad = 0;
for (const k of Object.keys(t)) {
  const s = t[k];
  if (!s || !s.sourceData || !s.content || !s.content[0]) continue;
  const cols = parseDDLColumnComments(s.sourceData.ddl);
  const headers = s.content[0];
  const lines = (getCreateTableDefinitionBody_ACU(s.sourceData.ddl) || '').split('\n').filter(l => l.trim());
  let bad = [];
  for (let i = 0; i < headers.length; i++) {
    const m = lines[i] ? lines[i].trim().match(/^([^\s,()]+)/) : null;
    const sqlName = m ? m[1] : '';
    const comment = cols.get(sqlName) || '';
    if (!matchesSheetHeader(sqlName, comment, headers[i])) bad.push('#' + i + '「' + headers[i] + '」vs ' + sqlName + '（' + comment + '）');
  }
  if (bad.length) totalBad += bad.length;
  console.log((bad.length ? '[FAIL] ' : 'OK    ') + k + ' (' + s.name + '): ' + (bad.length ? bad.join('; ') : headers.length + ' 列全匹配'));
}
console.log('\n总不匹配: ' + totalBad);
