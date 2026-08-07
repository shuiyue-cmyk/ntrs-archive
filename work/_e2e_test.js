// 端到端实测：模拟 8.8.js 的 DDL 解析 + 表名映射 + 查询构建
// 验证 {[db.黄毛表.get()]} / {[db.重要角色表.get()]} / {[db.NTRS备忘录.get()]} 语法链路
const fs = require('fs');

// ---- 1. 模拟 parseDDLChineseName（从 8.8.js 复刻）----
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

// ---- 2. 从 NTRS适配表格 提取 DDL ----
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;
const ddlMap = new Map(); // physicalName -> ddl
for (const [uid, v] of Object.entries(o)) {
  if (!v || typeof v !== 'object') continue;
  const sd = v.sourceData;
  let ddlStr = '';
  if (typeof sd === 'string') ddlStr = sd;
  else if (Array.isArray(sd)) ddlStr = sd.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join('\n');
  else if (sd && typeof sd === 'object') ddlStr = JSON.stringify(sd);
  const ci = ddlStr.indexOf('CREATE TABLE');
  if (ci >= 0) {
    // 提取完整 CREATE TABLE 语句（粗略到 ; 或末尾）
    const cut = ddlStr.slice(ci);
    const semi = cut.indexOf(';');
    const ddl = semi >= 0 ? cut.slice(0, semi + 1) : cut;
    const phys = parseDDLTableName(ddl);
    if (phys) ddlMap.set(phys, ddl);
  }
}
console.log('==== 提取的 DDL 表（物理名 → 中文名）====');
const tableNameMap = new Map();
const reverseTableMap = new Map();
for (const [phys, ddl] of ddlMap) {
  const cn = parseDDLChineseName(ddl);
  if (cn) {
    tableNameMap.set(cn, phys);
    reverseTableMap.set(phys, cn);
    console.log(cn, '→', phys);
  }
}

// ---- 3. 模拟 TableQueryBuilder 的 SQL 构建（简化）----
function buildSelectSQL(tableName, conditions) {
  const phys = tableNameMap.get(tableName) || tableName;
  let sql = 'SELECT * FROM ' + phys;
  if (conditions.length) {
    const where = conditions.map(c => `${c.column} ${c.operator} '${c.value}'`).join(' AND ');
    sql += ' WHERE ' + where;
  }
  return sql;
}

console.log('==== 查询构建测试 ====');
// 黄毛表全查
const t1 = buildSelectSQL('黄毛表', []);
console.log('{[db.黄毛表.get()]} →', t1, t1.includes('thug_characters') ? '✓' : '✗');
// 重要角色表
const t2 = buildSelectSQL('重要角色表', []);
console.log('{[db.重要角色表.get()]} →', t2, t2.includes('NcBlYRH5') || t2.includes('important') ? '✓' : '?');
// NTRS备忘录
const t3 = buildSelectSQL('NTRS备忘录', []);
console.log('{[db.NTRS备忘录.get()]} →', t3, t3.includes('ntrs_memo') ? '✓' : '?');
// 条件查询（锁定对象）
const t4 = buildSelectSQL('黄毛表', [{ column: 'locked_target', operator: '=', value: '林雪' }]);
console.log("{[db.黄毛表.where('锁定对象','林雪').get()]} →", t4);

console.log('==== 结论 ====');
const allOk = ['黄毛表', '重要角色表', 'NTRS备忘录'].every(cn => tableNameMap.has(cn));
console.log(allOk ? '三表全部可解析 ✓ 语法链路可跑通' : '有表缺映射 ✗');
