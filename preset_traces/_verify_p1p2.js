// 验收脚本：逐文件核对 8 项验收标准（只读）
const fs = require('fs');
const dir = __dirname + '/';
const files = [
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json',
  'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
function countIn(t, s) { return t.split(s).length - 1; }
for (const f of files) {
  let j;
  try { j = JSON.parse(fs.readFileSync(dir + f, 'utf8')); } catch (e) { console.log(f, 'FATAL parse:', e.message); continue; }
  const isArr = Array.isArray(j);
  const pt = j[0].plotTasks;
  const s2 = pt.find(t => t.name === '黄毛判定');
  const s3 = pt.find(t => t.name === '导演台本');
  const s2m = s2.promptGroup, s3m = s3.promptGroup;
  const s2_4 = s2m[4].content, s3_2 = s3m[2].content, s3_7 = s3m[7].content;
  const s3all = s3m.map(m => m.content).join('\n');
  const all = j[0].promptGroup.concat(s2m, s3m).map(m => m.content || '').join('\n');
  const full = JSON.stringify(j);
  const acc = {
    '1 顶层数组+可解析': isArr ? 'ok' : 'FAIL',
    '2 修复1 S2-MSG4含例外判act': s2_4.includes('例外判 act') ? 'ok' : 'FAIL',
    '3 修复2 S3-MSG2含剧情视角称呼': s3_2.includes('剧情视角称呼') ? 'ok' : 'FAIL',
    '4a 修复3 S3无暗中推手': s3all.includes('暗中推手') ? 'FAIL(残留' + countIn(s3all, '暗中推手') + '处)' : 'ok',
    '4b 修复3 暗→明仅在否定/改写语境': (() => {
      const n = countIn(s3all, '暗→明');
      return n === 0 ? 'ok(已无暗→明)' : 'FAIL(残留' + n + '处)';
    })(),
    '4c 修复3 S3推波三态映射已改写': s3all.includes('无暗中推手段') ? 'ok' : '检查',
    '5 修复4 全文件无无无黄毛': countIn(full, '无无黄毛') === 0 ? 'ok' : 'FAIL(残留' + countIn(full, '无无黄毛') + '处)',
    '6 修复5 S2-MSG4补列动向+线状态+五型+型体概要': s2_4.includes('补列动向+线状态+五型+型体概要') ? 'ok' : 'FAIL',
    '7 修复6 S3-MSG7关系标记': s3_7.includes('关系标记') ? 'ok' : 'FAIL',
    '7b 修复6 S3-MSG7无NTR标记残留': countIn(s3_7, 'NTR标记') === 0 ? 'ok' : 'FAIL(残留' + countIn(s3_7, 'NTR标记') + '处)',
    '8a 修复7-FT 假小子女体注记': !f.includes('FT') || s2_4.includes('假小子为女性身体') ? 'ok' : 'FAIL',
    '8b 修复7-DEI 无伪娘FT残留': !f.includes('DEI') || !full.includes('只刷新伪娘') ? 'ok' : 'FAIL',
  };
  console.log('========================================');
  console.log('FILE:', f);
  for (const [k, v] of Object.entries(acc)) console.log('  ' + k + ': ' + v);
  // plotTasks 仍为3
  console.log('  plotTasks数: ' + pt.length + '（' + pt.map(t => t.name).join('/') + '）');
  // 残留暗中（S3内，允许否定句）
  const ana = [];
  s3all.split('\n').forEach((ln, i) => { if (ln.includes('暗中')) ana.push(ln.trim().slice(0, 90)); });
  if (ana.length) console.log('  S3 残余「暗中」行（应为非推波语境或否定句）:');
  ana.forEach(a => console.log('    - ' + a));
}
