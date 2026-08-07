// 实测：从 NTRS适配表格 提取 DDL 中文表名 → 验证 NameMapper 映射 + 查询构建链路
// 模拟 8.8.js 的 parseDDLChineseName + resolveTableName 逻辑
const fs = require('fs');

// 1. 从 NTRS适配表格 读取各表（含 DDL/name）
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;

// 模拟：表的中文名（name 字段）→ sheet_uid
const tableNameMap = new Map();
for (const [uid, v] of Object.entries(o)) {
  if (v && typeof v === 'object' && v.name) {
    tableNameMap.set(v.name, uid);
  }
}
console.log('==== 中文表名 → uid 映射 ====');
for (const [cn, uid] of tableNameMap) {
  console.log(cn, '→', uid);
}

// 2. 验证目标三表映射
const targets = ['黄毛表', '重要角色表', 'NTRS备忘录'];
console.log('==== 目标表映射验证 ====');
for (const cn of targets) {
  const uid = tableNameMap.get(cn);
  console.log(cn, '→', uid, uid ? '✓ 可解析' : '✗ 缺映射');
}

// 3. 检查表是否有 DDL（决定 parseDDLChineseName 能否工作）
// 8.8.js 的映射来源是 DDL，但表格 JSON 里有 name 字段。检查 o 的结构是否有 ddl/columns
const first = o['sheet_thug_characters'];
console.log('==== 黄毛表结构 ====');
console.log('keys:', Object.keys(first).join(','));
console.log('name:', first.name, '| uid:', first.uid);
console.log('有 ddl?', 'ddl' in first, '| 有 content?', 'content' in first, '| 有 columns?', 'columns' in first);
// content 是表头
if (first.content) console.log('content 表头:', JSON.stringify(first.content).slice(0, 200));
