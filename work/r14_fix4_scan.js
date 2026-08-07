// 扫描 15 个 _2ALL 的 prologue 禁术语句 + R13 触发句 + 进度 bullet 精确文本
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('_2ALL.json') && !f.includes('bak'));
const probes = ['默契型', '禁止写', '等系统术语', '乐享型·人尽可夫（_2ALL 专属设定）】', '骚扰者互动作为触发事件计入', '进度 100%'];
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const hits = probes.map(a => a + ':' + (raw.split(a).length - 1)).filter(h => !h.endsWith(':0'));
  console.log(fn + (hits.length ? ' | ' + hits.join(' ') : ' | (none)'));
}
