// 按 straight 模板分类 FT（重组）+ DEI（从源目录复制）
const fs = require('fs');
const path = require('path');
const base = 'C:/Users/zouyu/Downloads/8月7日更新打包/不看READ ME问问题一律口球/剧情推进预设/';
const src = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const mk = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const classify = (variant, fromDir) => {
  const dir = base + variant + '/';
  mk(dir); mk(dir + 'BATTLE/'); mk(dir + 'revise/');
  const files = fs.readdirSync(fromDir).filter(f => f.startsWith('Cirno') && !f.includes('bak') && f.includes('_' + variant + '_') && f.includes('5.0-preview'));
  let moved = { root: 0, battle: 0, revise: 0 };
  for (const fn of files) {
    const isBATTLE = fn.includes('BATTLE_Turn_');
    const isRevise = fn.includes('_revise_');
    const target = isBATTLE ? dir + 'BATTLE/' + fn : isRevise ? dir + 'revise/' + fn : dir + fn;
    const from = fromDir === src ? src + fn : fromDir + fn;
    if (fromDir === src) fs.copyFileSync(from, target);
    else fs.renameSync(from, target);
    if (isBATTLE) moved.battle++; else if (isRevise) moved.revise++; else moved.root++;
  }
  return moved;
};
// straight 验证参考
console.log('straight 现有:');
console.log('  ' + fs.readdirSync(base + 'straight/').join(', '));
console.log('  BATTLE/: ' + fs.readdirSync(base + 'straight/BATTLE/').join(', '));
console.log('  revise/: ' + fs.readdirSync(base + 'straight/revise/').join(', '));
console.log('\nFT（移动重组）: ' + JSON.stringify(classify('FT', base + 'FT/')));
console.log('\nDEI（从源目录复制）: ' + JSON.stringify(classify('DEI', src)));
