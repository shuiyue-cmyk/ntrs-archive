const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const grps = {
  A: ['Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json'],
  B: ['Cirno_NTRS_turn_edit_straight_revise_4.7.json', 'Cirno_NTRS_turn_edit_FT_revise_4.7.json', 'Cirno_NTRS_turn_edit_DEI_revise_4.7.json'],
  C: ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'],
};
let allOk = true;
for (const g of ['A', 'B', 'C']) {
  for (const f of grps[g]) {
    const j = JSON.parse(fs.readFileSync(d + f, 'utf8'));
    const p = j[0];
    const tname = g === 'B' ? '黄毛判定·输入校准' : (g === 'A' ? '黄毛判定' : '导演台本');
    const pgIdx = g === 'A' ? 4 : 0;
    const task = p.plotTasks.find(t => t.name === tname);
    const msg = task.promptGroup[pgIdx];
    const c = msg.content;
    const blob = JSON.stringify(j);
    const cnt = (s, sub) => s.split(sub).length - 1;
    let ok = true, lines = [];
    lines.push('===== [' + g + '] ' + f + ' 顶层数组=' + Array.isArray(j) + ' JSON可解析=true');
    if (g === 'A') {
      const hasOldInPg4 = c.indexOf('≥2次') >= 0;
      const hasNew = c.indexOf('女主的行为有没有表现出已选择 {{user}}') >= 0;
      const pg4Residual = cnt(c, '≥2次');
      const wholeResidual = cnt(blob, '≥2次');
      const s3 = p.plotTasks.find(t => t.name === '导演台本');
      const s3Hits = (s3.promptGroup || []).map((m, i) => cnt(m.content, '≥2次') > 0 ? 'pg[' + i + ']' : null).filter(Boolean);
      ok = hasNew && pg4Residual === 0;
      lines.push('  [S2 pg4] ≥2次=' + pg4Residual + ' 女主行为句=' + cnt(c, '女主的行为有没有表现出已选择') + ' 旧句=' + (hasOldInPg4 ? '残留' : '已清除'));
      lines.push('  [S3] ≥2次残留位置=' + s3Hits.join(',') + '（straight 参考版同处亦保留，超出本次 S2 pg4 范围）');
      lines.push('  全预设 ≥2次=' + wholeResidual + ' 41%=' + cnt(blob, '41%'));
    }
    if (g === 'B') {
      ok = c.indexOf('黄毛行动不依赖本轮是否刷新在场') >= 0 && cnt(c, '本轮在场是否合理（合理→spawn，不合理→no_spawn 走快速通道）') === 0;
      lines.push('  [pg0] 新句「黄毛行动不依赖本轮是否刷新在场」=' + cnt(c, '黄毛行动不依赖本轮是否刷新在场') + '处 旧句残留=' + cnt(c, '本轮在场是否合理（合理→spawn，不合理→no_spawn 走快速通道') + ' 全预设旧句=' + cnt(blob, '本轮在场是否合理'));
    }
    if (g === 'C') {
      ok = c.indexOf('场景外场景') >= 0 && c.indexOf('若黄毛与对象均在 {{user}} 当前场景之外') >= 0;
      lines.push('  [pg0] 「场景外场景」=' + cnt(c, '场景外场景') + '处 场景外句=' + cnt(c, '若黄毛与对象均在 {{user}} 当前场景之外'));
      lines.push('  全预设「场景外场景」=' + cnt(blob, '场景外场景') + '处');
    }
    lines.push('  => ' + (ok ? 'PASS' : 'FAIL'));
    if (!ok) allOk = false;
    console.log(lines.join('\n'));
  }
}
console.log('\nALL: ' + (allOk ? 'PASS' : 'FAIL'));
// 展示 B/C 最终文本片段
const jb = JSON.parse(fs.readFileSync(d + 'Cirno_NTRS_turn_edit_DEI_revise_4.7.json', 'utf8'));
const tb = jb[0].plotTasks.find(t => t.name === '黄毛判定·输入校准');
console.log('\n--- B DEI_revise pg0 职责段片段 ---');
const bc = tb.promptGroup[0].content;
console.log(JSON.stringify(bc.slice(0, bc.indexOf('；未命中') + 6)));
const jc = JSON.parse(fs.readFileSync(d + 'Cirno_BATTLE_Turn_DEI_NTRS.json', 'utf8'));
const tc = jc[0].plotTasks.find(t => t.name === '导演台本');
const cc = tc.promptGroup[0].content;
console.log('\n--- C DEI_NTRS pg0 act 编排段片段 ---');
const at = cc.indexOf('目标离场时黄毛尾随');
console.log(JSON.stringify(cc.slice(at - 30, at + 240)));
