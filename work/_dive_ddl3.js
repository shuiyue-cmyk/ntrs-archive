// 1. 黄毛表 DDL 第一行（确认 parseDDLChineseName 能命中）
// 2. 8.8.js 映射构建触发（谁调用 setNameMapping / 构建循环）
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;
const hm = o['sheet_thug_characters'];
const sd = hm.sourceData;
// sourceData 可能含多个 DDL，找 CREATE TABLE 行
const firstCreate = sd.indexOf('CREATE TABLE');
console.log('==== DDL 第一行 ====');
const ddlStart = sd.slice(firstCreate, firstCreate + 200);
console.log(JSON.stringify(ddlStart.split('\n')[0]));

const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');
// 找映射构建循环的起点（谁遍历 sheets 构建 mapper）
const anchor = 'mapper.tableNameMap.set(chineseTableName, englishTableName)';
let i = src.indexOf(anchor);
console.log('==== 映射构建循环（anchor 上方 1500 字） ====');
if (i >= 0) console.log(src.slice(i - 1500, i + 150));
