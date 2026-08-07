const fs = require('fs');
const cp = require('child_process');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
for (let i = 0; i < 5; i++) {
  const b = fs.readFileSync(p);
  const s = b.toString('utf8');
  const t = fs.statSync(p);
  console.log(i, 'bytes', b.length,
    'NEW', s.includes('公共空间宽松判定'),
    'OLD', s.includes('为唯一基准——黄毛**本轮能否进入'),
    'mtime', t.mtime.toISOString(),
    'head', JSON.stringify(s.slice(0, 20)));
  cp.execSync('powershell -Command "Start-Sleep -Milliseconds 400"');
}
