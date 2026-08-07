// R19d：desc 同步（30 个 NTRS 文件）——追踪分级/察觉迎合/苦主/人尽可夫/配合黄毛表
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const WB = '**世界书选择（仅决定启用条目）：本轮登场角色设定类条目';
const N12_S2_INS = '**配合黄毛表判定（黄毛表为型体/锁定/淫妻线进度权威源），黄毛动向追踪维持跨轮动向连续性——追踪分级：无判定（no-act）轮极简、场外可 act 丰富、no_spawn act 严谨判定；对象追踪仅离场对象。**\n';
const N12_S3_OLD = '落实知情度三档（在场见证/事后知情/完全不知）与 NTRS 进度';
const N12_S3_NEW = '落实知情度三档（在场见证/事后知情/完全不知）与 NTRS 进度（对象察觉迎合；追踪按判定状态分级——无判定极简、场外可 act 丰富）';
const N12_S3_NEW_2A = '落实知情度三档（在场见证/事后知情/完全不知）与 NTRS 进度（对象察觉迎合；追踪按判定状态分级——无判定极简、场外可 act 丰富；_2ALL：乐享型后对象人尽可夫，临时骚扰者体系）';
const HYB_S2_NOTBL = '不依赖任何表格：从剧情中梳理';
const HYB_S2_FIX = '配合黄毛表：从剧情中梳理';
const HYB_S2_INS = '**追踪分级：无判定（no-act）轮极简、场外可 act 丰富、no_spawn act 严谨判定。**\n';
const HYB_S3_ZHONG = '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活）';
const HYB_S3_ZHONG_2A = '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活——编排参考传统 NTR：user=苦主、对象=女主、黄毛=牛头人；_2ALL：乐享型后对象人尽可夫，临时骚扰者体系）';
const HYB_S3_ZHONG_B = '黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续，黄毛不多介入 {{user}} 生活——编排参考传统 NTR：user=苦主、对象=女主、黄毛=牛头人）';
const HYB_S3_GRADE = '无互动推进时简化输出。';
const HYB_S3_GRADE_NEW = '追踪分级：无判定极简/场外可 act 丰富/no_spawn act 严谨判定。无互动推进时简化输出。';

let fail = 0;
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const isHyb = fn.startsWith('Cirno_BATTLE_Turn') && fn.includes('_NTRS');
  const is2 = fn.endsWith('_2ALL.json');
  if (!isN && !isHyb) continue; // 只改 NTRS 系 30 文件
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  if (!s2 || !s3) { console.log('[FAIL] tasks ' + fn); fail++; continue; }
  let log = [];
  // S2 desc
  let d2 = s2.description || '';
  if (isN) {
    if (d2.includes(WB)) { d2 = d2.split(WB).join(N12_S2_INS + WB); log.push('N12-S2'); }
    else { console.log('[FAIL] N12 S2 WB anchor ' + fn); fail++; }
  } else {
    if (d2.includes(HYB_S2_NOTBL)) { d2 = d2.split(HYB_S2_NOTBL).join(HYB_S2_FIX); log.push('HYB-S2-tbl'); }
    else { console.log('[FAIL] HYB S2 notbl ' + fn); fail++; }
    if (d2.includes(WB)) { d2 = d2.split(WB).join(HYB_S2_INS + WB); log.push('HYB-S2-grade'); }
    else { console.log('[FAIL] HYB S2 WB ' + fn); fail++; }
  }
  s2.description = d2;
  // S3 desc
  let d3 = s3.description || '';
  if (isN) {
    if (d3.includes(N12_S3_OLD)) { d3 = d3.split(N12_S3_OLD).join(is2 ? N12_S3_NEW_2A : N12_S3_NEW); log.push('N12-S3'); }
    else { console.log('[FAIL] N12 S3 anchor ' + fn); fail++; }
  } else {
    if (d3.includes(HYB_S3_ZHONG)) { d3 = d3.split(HYB_S3_ZHONG).join(is2 ? HYB_S3_ZHONG_2A : HYB_S3_ZHONG_B); log.push('HYB-S3-zhong'); }
    else { console.log('[FAIL] HYB S3 zhong ' + fn); fail++; }
    if (d3.includes(HYB_S3_GRADE)) { d3 = d3.split(HYB_S3_GRADE).join(HYB_S3_GRADE_NEW); log.push('HYB-S3-grade'); }
    else { console.log('[FAIL] HYB S3 grade ' + fn); fail++; }
  }
  s3.description = d3;
  fs.writeFileSync(dir + fn, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': ' + log.join(' + ') + ' OK');
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
