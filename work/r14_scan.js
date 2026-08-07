// 扫描 R14 候选锚点在 18 版的出现情况
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const anchors = [
  '供本轮行动判定与后续轮次衔接。',                       // BATTLE S2 追踪说明尾
  '你须照其编排对应线状态的戏——目标离场时黄毛仍可尾随/赶赴行动：', // BATTLE S3 引用
  '两种分支都输出 <thugSpawn> 与 <thugSpawnReason>',     // NTRS12 S2 职责
  '输出 <thugSpawn> 与 <thugSpawnReason>',                // NTRS12 S2 职责(宽)
  '基于你自己的判定结果与本轮剧情',                        // NTRS12 S2 职责第二步
  '{{thugSpawn}}',                                        // S3 引用
];
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const isNTRS12 = fn.startsWith('Cirno_NTRS_turn_edit');
  const hits = anchors.map(a => a + ':' + (raw.split(a).length - 1)).filter(h => !h.endsWith(':0'));
  console.log(fn + (isNTRS12 ? ' [N12]' : ' [B]') + (hits.length ? ' | ' + hits.join(' ') : ' | (none)'));
}
