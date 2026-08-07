// 1. 黄毛表 sourceData 结构（是否含 DDL 中文名）
// 2. 8.8.js parseDDLChineseName + 映射构建触发点
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;
const hm = o['sheet_thug_characters'];
console.log('==== 黄毛表 sourceData 前800字 ====');
console.log(JSON.stringify(hm.sourceData || '').slice(0, 800));

const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');
// parseDDLChineseName 函数
let i = src.indexOf('function parseDDLChineseName');
console.log('==== parseDDLChineseName ====');
if (i >= 0) console.log(src.slice(i, i + 700));
// 映射构建触发（谁调用 setNameMapping / publishNameMapper）
i = src.indexOf('tableNameMap.set');
console.log('==== tableNameMap.set 上下文 ====');
if (i >= 0) console.log(JSON.stringify(src.slice(i - 300, i + 200)).slice(0, 500));
