// 查看黄毛表 sourceData 确切结构
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const o = Array.isArray(t) ? t[0] : t;
const hm = o['sheet_thug_characters'];
console.log('sourceData keys:', Object.keys(hm.sourceData || {}));
// 打印 sourceData 里每个 key 的前100字
for (const [k, v] of Object.entries(hm.sourceData || {})) {
  console.log('[' + k + ']', typeof v === 'string' ? JSON.stringify(v.slice(0, 120)) : typeof v);
}
// 找 CREATE TABLE 所在字段
const sd = hm.sourceData;
for (const [k, v] of Object.entries(sd || {})) {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  if (s.includes('CREATE TABLE')) {
    console.log('CREATE TABLE 在字段 [' + k + '] 中');
    const ci = s.indexOf('CREATE TABLE');
    console.log('  片段:', JSON.stringify(s.slice(ci, ci + 150)));
  }
}
