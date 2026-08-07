// 勘察 33 文件 name + 文件名
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
console.log('共 ' + files.length + ' 个文件：\n');
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  console.log(fn + '  ==>  name: ' + root.name);
}
