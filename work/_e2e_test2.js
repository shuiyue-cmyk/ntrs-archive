// 端到端实测（修正版）：正确从 sourceData.ddl 提取 → 模拟 fromDDLs 映射 → 查询构建
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;

// 复刻 8.8.js parseDDLChineseName / parseDDLTableName
function parseDDLChineseName(ddl) {
  if (!ddl) return null;
  const firstLine = ddl.split('\n')[0];
  const match = firstLine.match(/--\s*(.+?)\s*$/);
  return match ? match[1].trim() : null;
}
function parseDDLTableName(ddl) {
  const m = ddl.match(/CREATE\s+TABLE\s+([A-Za-z_][A-Za-z0-9_]*)/i);
  return m ? m[1] : null;
}

// 提取所有表 DDL（sourceData.ddl）
const tableNameMap = new Map(); // 中文 → 物理
const reverseTableMap = new Map(); // 物理 → 中文
for (const [uid, v] of Object.entries(o)) {
  if (!v || typeof v !== 'object' || !v.sourceData) continue;
  const ddl = v.sourceData.ddl;
  if (typeof ddl !== 'string' || !ddl.includes('CREATE TABLE')) continue;
  const phys = parseDDLTableName(ddl);
  const cn = parseDDLChineseName(ddl);
  if (phys && cn) {
    tableNameMap.set(cn, phys);
    reverseTableMap.set(phys, cn);
  }
}
console.log('==== 中文表名 → 物理表名 映射 ====');
for (const [cn, phys] of tableNameMap) console.log(cn, '→', phys);

// 模拟 TableQueryBuilder 查询构建（简化版，复刻 _buildSelect）
function buildQuery(cn, conds = []) {
  const phys = tableNameMap.get(cn);
  if (!phys) return '✗ 无映射: ' + cn;
  let sql = 'SELECT * FROM ' + phys;
  if (conds.length) {
    sql += ' WHERE ' + conds.map(c => `"${c.col}" ${c.op} '${c.val}'`).join(' AND ');
  }
  return sql;
}

console.log('==== 查询构建验证 ====');
const tests = [
  ['黄毛表全查', buildQuery('黄毛表')],
  ['重要角色表全查', buildQuery('重要角色表')],
  ['NTRS备忘录全查', buildQuery('NTRS备忘录')],
  ["黄毛表where锁定对象", buildQuery('黄毛表', [{ col: 'locked_target', op: '=', val: '林雪' }])],
];
for (const [name, sql] of tests) {
  console.log('[' + name + ']', sql);
}
const ok = ['黄毛表', '重要角色表', 'NTRS备忘录'].every(cn => tableNameMap.has(cn));
console.log('==== 结论 ====');
console.log(ok ? '✓ 三表全部可映射，语法链路可跑通' : '✗ 有表缺映射');
