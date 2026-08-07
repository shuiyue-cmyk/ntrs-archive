// R19 发布前审核：30 个 NTRS 文件（NTRS12 24 + NTRS·雄竞 6）结构/语义/残留/隔离/一致性
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const all = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak') && (f.includes('NTRS') || f.includes('_NTRS')));
const n12 = all.filter(f => f.startsWith('Cirno_NTRS_turn_edit'));
const hyb = all.filter(f => f.startsWith('Cirno_BATTLE_Turn') && f.includes('_NTRS'));
const n12base = n12.filter(f => !f.endsWith('_2ALL.json'));
const n122 = n12.filter(f => f.endsWith('_2ALL.json'));
const hybBase = hyb.filter(f => !f.endsWith('_2ALL.json'));
const hyb2 = hyb.filter(f => f.endsWith('_2ALL.json'));
console.log('分组: NTRS12原版=' + n12base.length + ' NTRS12_2ALL=' + n122.length + ' 雄竞原版=' + hybBase.length + ' 雄竞_2ALL=' + hyb2.length);
let fail = 0;
const cnt = (s, t) => s.split(t).length - 1;

// 关键语义短语（每个文件应包含）
const N12_NEED = ['亲密关系达成', '察觉', '口述', '黄毛动向追踪', '对象动向追踪', '无判定（no-act）轮极简', '舔狗型', '淫妻线五型'];
const HYB_NEED = ['亲密开局分流', 'NTRS期·亲密开局', '黄毛胜·终局', '编排参考传统 NTR：user=苦主', '41%，即第三阶段', '黄毛动向追踪', '对象动向追踪', '无判定（no-act）轮极简', '舔狗型', '配合黄毛表', '与黄毛表兼容判定'];
const ALL2_NEED = ['乐享型·人尽可夫', '临时骚扰者', '人尽可夫补充细则', '每轮所有骚扰者合计仍按 +0~5%/轮封顶', '仅对象离场时追踪'];

// 残留（应=0）
const RESID = ['不读表格', '不查表判断', '接下来的场景中该黄毛是否有出现的可能', '黄毛败·友好', '即使动向/线状态与上轮相同也须完整列出'];

for (const fn of all) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.log('[FAIL] JSON ' + fn + ': ' + e.message); fail++; continue; }
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const blob = JSON.stringify(j);
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const is2 = fn.endsWith('_2ALL.json');
  const need = isN ? N12_NEED : HYB_NEED;
  const miss = need.filter(t => !blob.includes(t));
  const resid = RESID.filter(t => blob.includes(t));
  const all2miss = is2 ? ALL2_NEED.filter(t => !blob.includes(t)) : [];
  const singleBrace = (blob.match(/(?<!\{)\{user\}(?!\})/g) || []).length + (blob.match(/(?<!\{)\{char\}(?!\})/g) || []).length;
  const ok = miss.length === 0 && resid.length === 0 && all2miss.length === 0 && singleBrace === 0;
  console.log(fn + (isN ? ' [N12' : ' [HYB') + (is2 ? '-2A]' : ']') + (ok ? ' OK' : ' [FAIL]') +
    (miss.length ? ' 缺:' + miss.join('|') : '') + (resid.length ? ' 残留:' + resid.join('|') : '') +
    (all2miss.length ? ' 2A缺:' + all2miss.join('|') : '') + (singleBrace ? ' 单括号:' + singleBrace : ''));
  if (!ok) fail++;
}
console.log('\n==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
