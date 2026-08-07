// R19 复验：通用检查串（容忍版本措辞差异）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const all = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak') && (f.includes('NTRS') || f.includes('_NTRS')));
let fail = 0;
for (const fn of all) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const blob = JSON.stringify(JSON.parse(raw));
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const is2 = fn.endsWith('_2ALL.json');
  // 通用语义检查（容忍措辞差异）
  const gate = isN ? (blob.includes('积极行动门') && (blob.includes('已建立较为亲密关系') || blob.includes('亲密关系达成') || blob.includes('达成亲密'))) : true;
  const stages = isN ? (blob.includes('忠诚型') && blob.includes('乐享型')) : true;
  const hook = isN ? (blob.includes('察觉') && (blob.includes('迎合') || blob.includes('配合'))) : true;
  const report = isN ? (blob.includes('口述') && (blob.includes('录像') || blob.includes('视频'))) : true;
  const track1 = blob.includes('黄毛动向追踪');
  const track2 = blob.includes('对象动向追踪') && blob.includes('仅对象离场时追踪');
  const graded = blob.includes('极简');
  const six = blob.includes('舔狗型');
  const hybOk = !isN ? (blob.includes('亲密开局分流') && blob.includes('NTRS期·亲密开局') && blob.includes('编排参考传统 NTR：user=苦主') && blob.includes('41%，即第三阶段') && blob.includes('配合黄毛表')) : true;
  const all2Ok = is2 ? (blob.includes('乐享型·人尽可夫') && blob.includes('人尽可夫补充细则') && blob.includes('每轮所有骚扰者合计仍按 +0~5%/轮封顶')) : true;
  const resid = ['不读表格', '不查表判断', '黄毛败·友好', '接下来的场景中该黄毛是否有出现的可能'].filter(t => blob.includes(t));
  const ok = gate && stages && hook && report && track1 && track2 && graded && six && hybOk && all2Ok && resid.length === 0;
  console.log(fn + (isN ? ' [N12' : ' [HYB') + (is2 ? '-2A]' : ']') + ' ' + (ok ? 'OK' : '[FAIL]') +
    (resid.length ? ' 残留:' + resid.join('|') : '') +
    (!gate ? ' 门!' : '') + (!stages ? ' 阶段!' : '') + (!hook ? ' 察觉!' : '') + (!report ? ' 报告!' : '') +
    (!track1 ? ' 黄毛追踪!' : '') + (!track2 ? ' 对象追踪!' : '') + (!graded ? ' 分级!' : '') + (!six ? ' 六型!' : '') +
    (!hybOk ? ' 雄竞语义!' : '') + (!all2Ok ? ' 2A!' : ''));
  if (!ok) fail++;
}
console.log('\n==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
