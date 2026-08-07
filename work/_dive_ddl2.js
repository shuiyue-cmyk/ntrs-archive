// 1. 表格 JSON 是否有 DDL（CREATE TABLE）？
// 2. 8.8.js 构建映射的循环上下文（englishTableName/ddl 来源）
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;
const hm = o['sheet_thug_characters'];
console.log('==== 黄毛表是否有 DDL/CREATE ====');
const sd = JSON.stringify(hm.sourceData || '');
console.log('sourceData 含 CREATE TABLE:', sd.includes('CREATE TABLE'));
console.log('sourceData 含 -- 黄毛表:', sd.includes('-- 黄毛表'));
// 全表扫描 ddl
for (const k of Object.keys(o)) {
  const v = o[k];
  const s = JSON.stringify(v || '');
  if (s.includes('CREATE TABLE') && !s.startsWith('"')) {
    console.log(k, '含 CREATE TABLE');
  }
}

const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');
// 找构建映射的循环（englishTableName + ddl）
let i = src.indexOf('parseDDLChineseName(ddl)');
// 往上找循环
const ctx = src.slice(Math.max(0, i - 2500), i + 200);
console.log('==== 映射构建循环上下文（前2500字） ====');
console.log(ctx.slice(-2200));
