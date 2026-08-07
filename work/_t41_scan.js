// 快速扫描 18 文件改动落地状态
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_(NTRS_turn_edit|BATTLE_Turn).*\.json$/.test(f));
for (const fn of files) {
  const raw = fs.readFileSync(base + fn, 'utf8');
  const j = JSON.parse(raw);
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  const s2 = JSON.stringify(t2.promptGroup);
  const s3 = JSON.stringify(t3.promptGroup);
  const topArr = raw.trim().startsWith('[');
  const checks = {
    '快速通道原始(跳过导演分析)': s3.includes('跳过全部导演分析') && !s3.includes('不跳过导演分析'),
    '未spawn可行动': s2.includes('黄毛行动不依赖本轮是否刷新在场') || s2.includes('黄毛行动不依赖本轮是否刷新'),
    '场景外stage字段': s3.includes('场景外标注'),
    '败判定去数值化': !s2.includes('≥2') && (s2.includes('综合判断女主') || s2.includes('综合判断对象') || s2.includes('行为是否选择了')),
    'JSON合法': true,
    '顶层数组': topArr,
  };
  const fails = Object.entries(checks).filter(([k, v]) => v === false).map(([k]) => k);
  console.log(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, ''), fails.length ? '❌ ' + fails.join('|') : '✓');
}
