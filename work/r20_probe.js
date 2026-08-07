// R20 侦查：两体系 S2 thugSpawn 模板追踪区块 + S3 引用段的准确文本（替换点定位）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const probe = (fn, label) => {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  console.log('\n========== ' + fn + ' (' + label + ') ==========');
  // S2-MSG0 追踪说明
  let c0 = s2.promptGroup[0].content || '';
  let i = c0.indexOf('黄毛动向追踪是跨轮记忆');
  if (i !== -1) console.log('S2-MSG0 追踪说明: ' + JSON.stringify(c0.slice(i - 10, i + 200)));
  // S2 追踪区块格式（BATTLE 分支A 模板）
  let c4 = s2.promptGroup[4].content || '';
  let k = c4.indexOf('【黄毛动向追踪】（每轮必列');
  if (k !== -1) console.log('S2 模板追踪块: ' + JSON.stringify(c4.slice(k - 40, k + 150)));
  k = c4.indexOf('【黄毛动向追踪】（仍须列出');
  if (k !== -1) console.log('S2 no_spawn 追踪块: ' + JSON.stringify(c4.slice(k - 30, k + 100)));
  k = c4.indexOf('【黄毛动向追踪】（本轮新刷');
  if (k !== -1) console.log('S2 分支B 追踪块: ' + JSON.stringify(c4.slice(k - 30, k + 100)));
  // NTRS12 R15 说明
  k = c0.indexOf('thugSpawn 内同时输出【黄毛动向追踪】');
  if (k !== -1) console.log('S2 NTRS12 追踪说明: ' + JSON.stringify(c0.slice(k - 20, k + 120)));
  k = c4.indexOf('thugSpawn 内附【黄毛动向追踪】区块');
  if (k !== -1) console.log('S2 m4 追踪区块说明: ' + JSON.stringify(c4.slice(k - 30, k + 100)));
  // S3 引用段
  let d3 = s3.promptGroup[0].content || '';
  let p = d3.indexOf('【黄毛动向追踪】每个已刷新');
  if (p !== -1) console.log('S3 追踪引用: ' + JSON.stringify(d3.slice(p - 30, p + 140)));
  p = d3.indexOf('不在 thugSpawn 标签里找）');
  if (p !== -1) console.log('S3 NTRS12 引用段: ' + JSON.stringify(d3.slice(p - 20, p + 200)));
};
probe('Cirno_BATTLE_Turn_straight.json', 'BATTLE 纯雄竞');
probe('Cirno_BATTLE_Turn_straight_NTRS.json', 'NTRS·雄竞');
probe('Cirno_NTRS_turn_edit_straight_4.7.json', 'NTRS12');
