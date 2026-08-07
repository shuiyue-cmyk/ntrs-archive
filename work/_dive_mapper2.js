// 查 NameMapper.fromDDLs 的调用点（全局 mapper 构建触发）
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');
const anchor = 'NameMapper.fromDDLs';
let i = src.indexOf(anchor);
let n = 0;
console.log('==== NameMapper.fromDDLs 调用点 ====');
while (i >= 0 && n < 8) {
  console.log('@' + i, JSON.stringify(src.slice(Math.max(0, i - 200), i + 120)).slice(0, 340));
  i = src.indexOf(anchor, i + 1);
  n++;
}
