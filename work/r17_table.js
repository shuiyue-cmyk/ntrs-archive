// R17 表格更新：A 黄毛表六型 + B 重要角色表是否离场增强 + C NTRS备忘录 2ALL 提示
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
let fail = 0;

// ===== A. 黄毛表六型 =====
const thug = j.sheet_thug_characters;
// A1. header 五型 -> 六型（content[0] index 11）
const hdrIdx = thug.content[0].indexOf('五型');
if (hdrIdx !== -1) { thug.content[0][hdrIdx] = '六型'; } else { console.log('[FAIL] header 五型 not found'); fail++; }
// A2. DDL
thug.sourceData.ddl = thug.sourceData.ddl.split('five_type TEXT, -- 五型').join('six_type TEXT, -- 六型');
// A3. note 列11 定义
thug.sourceData.note = thug.sourceData.note.split('- 列11: 五型 five_type（权力型 / 魅力型 / 隐秘型 / 强制型 / 诱惑型）').join('- 列11: 六型 six_type（权力型 / 魅力型 / 隐秘型 / 强制型 / 诱惑型 / 舔狗型——舔狗型用供：卑微讨好/供奉式）');
// A4. note 多目标段
thug.sourceData.note = thug.sourceData.note.split('不改变性别类型/五型/型体设定').join('不改变性别类型/六型/型体设定');
// A5. SQL 节点 five_type -> six_type（init/insert/update）
for (const k of ['initNode', 'insertNode', 'updateNode']) {
  thug.sourceData[k] = (thug.sourceData[k] || '').split('five_type').join('six_type');
}

// ===== 黄毛日记表 六型 + 舔狗型笔触 =====
const diary = j.sheet_thug_diary;
diary.sourceData.note = diary.sourceData.note
  .split('符合黄毛当前五型特征').join('符合黄毛当前六型特征')
  .split('五型差异必须渗透笔触：权力型写掌控与压迫感的合理化；魅力型写情场自信与自诩体贴；隐秘型写窥伺与伪装无害；强制型写力量与征服的理所当然；诱惑型写勾引与自我陶醉；')
  .join('六型差异必须渗透笔触：权力型写掌控与压迫感的合理化；魅力型写情场自信与自诩体贴；隐秘型写窥伺与伪装无害；强制型写力量与征服的理所当然；诱惑型写勾引与自我陶醉；舔狗型写卑微讨好与奉承的自我合理化；')
  .split('符合黄毛五型与型体设定').join('符合黄毛六型与型体设定');

// ===== B. 重要角色表 是否离场增强 =====
const imp = j.sheet_NcBlYRH5;
imp.sourceData.note = imp.sourceData.note.split('列6: 是否离场 - 判断该角色是否能直接与主角互动，填写“是”或“否”。')
  .join('列6: 是否离场 - 判断该角色是否能直接与主角互动，填写“是”或“否”；**离场时建议补充去向/状态**（配合对象动向追踪：位置=[离场·去向]；状态=独处/社交/外出/在家/工作等）。');

// ===== C. NTRS备忘录 2ALL 提示 =====
const memo = j.sheet_ntrs_memo;
memo.sourceData.note = memo.sourceData.note.split('特殊事件。已客观发生的完整经过')
  .join('特殊事件（2ALL 版可记「乐享型·人尽可夫」激活状态）。已客观发生的完整经过');

// 写回
fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');

// ===== 验证 =====
const back = JSON.parse(fs.readFileSync(p, 'utf8'));
const bthug = back.sheet_thug_characters;
const bdiary = back.sheet_thug_diary;
const bimp = back.sheet_NcBlYRH5;
const bmemo = back.sheet_ntrs_memo;
// hydrate: header vs DDL comment
const hdr11 = bthug.content[0][11];
const ddlSix = bthug.sourceData.ddl.includes('six_type TEXT, -- 六型');
const hdrOk = hdr11 === '六型' && ddlSix;
// 六型就位
const noteSix = bthug.sourceData.note.includes('六型 six_type') && bthug.sourceData.note.includes('舔狗型');
const sqlNoFive = !bthug.sourceData.initNode.includes('five_type') && !bthug.sourceData.insertNode.includes('five_type') && !bthug.sourceData.updateNode.includes('five_type');
const diarySix = bdiary.sourceData.note.includes('六型') && bdiary.sourceData.note.includes('舔狗型写卑微讨好');
const diaryNoFive = !bdiary.sourceData.note.includes('五型');
const impOk = bimp.sourceData.note.includes('离场时建议补充去向/状态');
const memoOk = bmemo.sourceData.note.includes('2ALL 版可记「乐享型·人尽可夫」激活状态');
const allOk = hdrOk && noteSix && sqlNoFive && diarySix && diaryNoFive && impOk && memoOk;
console.log('黄毛表 header[11]=' + hdr11 + ' DDL=' + ddlSix + ' note六型=' + noteSix + ' SQL无five_type=' + sqlNoFive);
console.log('日记表 六型+舔狗笔触=' + diarySix + ' 无五型残留=' + diaryNoFive);
console.log('重要角色表 离场增强=' + impOk);
console.log('备忘录 2ALL提示=' + memoOk);
console.log(allOk ? 'ALL PASS' : '[FAIL]');
process.exit(allOk ? 0 : 1);
