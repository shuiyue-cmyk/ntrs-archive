// dump R20 审查 BUG 相关锚点实际文本
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const probe = (fn) => {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const s2 = j[0].plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = j[0].plotTasks.find(t => t.id === 'defaultPlotTask');
  console.log('##### ' + fn);
  let all = s2.promptGroup.map(m => m.content || '').join('\n');
  // A. 旧句残留
  for (const k of ['含【黄毛动向追踪】区块', '写进 <thugSpawn> 的【黄毛动向追踪】区块', '标签内放刷新状态+黄毛人设+追踪区块', 'thugSpawn 内输出【对象动向追踪】', 'thugSpawn 内附【对象动向追踪】行']) {
    const c = all.split(k).length - 1;
    if (c > 0) console.log('  A旧句「' + k + '」: ' + c);
  }
  // B. 输出顺序行
  let i = all.indexOf('Output tags in order');
  if (i !== -1) console.log('  B顺序行: ' + JSON.stringify(all.slice(i, i + 90)));
  // C. Immediately after
  i = all.indexOf('Immediately after');
  if (i !== -1) console.log('  C: ' + JSON.stringify(all.slice(i, i + 80)));
  // D. STEP3 表头
  i = all.indexOf('标签内只放刷新状态+黄毛人设');
  if (i !== -1) console.log('  D表头: ' + JSON.stringify(all.slice(i - 15, i + 80)));
  // E. sparkNotes 收尾
  i = all.indexOf('提醒自己');
  if (i !== -1) console.log('  E: ' + JSON.stringify(all.slice(i - 10, i + 70)));
  // F. S3 角色描述
  let s3all = s3.promptGroup.map(m => m.content || '').join('\n');
  i = s3all.indexOf('读取上游交付');
  if (i !== -1) console.log('  F S3角色: ' + JSON.stringify(s3all.slice(i - 15, i + 100)));
  // G. 双冒号
  i = s3all.indexOf('追踪见下');
  if (i !== -1) console.log('  G: ' + JSON.stringify(s3all.slice(i - 20, i + 30)));
  // H. 自检
  i = s3all.indexOf('sparkNotes');
  if (i !== -1) console.log('  H sparkNotes 提及: ' + JSON.stringify(s3all.slice(i, i + 60)));
};
probe('Cirno_BATTLE_Turn_straight.json');
probe('Cirno_NTRS_turn_edit_straight_4.7.json');
