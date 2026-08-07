// 扫描 18 版「五」字组合词（防 R12 批量替换误伤）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const combos = {};
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  let i = 0;
  while ((i = raw.indexOf('五', i)) !== -1) {
    let j = i + 1;
    while (j < raw.length && /[\u4e00-\u9fff]/.test(raw[j])) j++;
    const seg = raw.slice(i, j);
    if (!combos[seg]) combos[seg] = 0;
    combos[seg]++;
    i = j;
  }
}
const rows = Object.entries(combos).sort((a, b) => b[1] - a[1]);
for (const [k, v] of rows) console.log(k + ' : ' + v);
