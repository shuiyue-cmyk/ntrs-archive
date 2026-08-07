// 1. 黄毛表 sourceData 里 DDL 第一行
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;
const hm = o['sheet_thug_characters'];
const sd = hm.sourceData;
console.log('sourceData 类型:', typeof sd, Array.isArray(sd) ? 'array' : '');
// sourceData 可能是对象或数组或字符串
let ddlStr = '';
if (typeof sd === 'string') ddlStr = sd;
else if (Array.isArray(sd)) ddlStr = sd.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join('\n');
else ddlStr = JSON.stringify(sd);
const firstCreate = ddlStr.indexOf('CREATE TABLE');
console.log('==== DDL 附近 ====');
console.log(JSON.stringify(ddlStr.slice(firstCreate, firstCreate + 300)).slice(0, 350));

// 2. 8.8.js 映射构建循环
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');
const anchor = 'mapper.tableNameMap.set(chineseTableName, englishTableName)';
let i = src.indexOf(anchor);
console.log('==== 映射构建循环（anchor 上方 1600 字） ====');
if (i >= 0) console.log(src.slice(i - 1600, i + 120));
