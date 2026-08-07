// R15 同步：NTRS·雄竞 6 文件（3 原版 + 3 _2ALL）与 NTRS 主干同步——兼容查表 + no_spawn 联动
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json', 'Cirno_BATTLE_Turn_straight_NTRS_2ALL.json', 'Cirno_BATTLE_Turn_FT_NTRS_2ALL.json', 'Cirno_BATTLE_Turn_DEI_NTRS_2ALL.json'];

const FIXES = [
  // 1. S2-MSG0 追踪说明：不读表格 → 配合黄毛表
  { from: '**黄毛动向追踪是跨轮记忆的替代**：判定任务不读表格，改靠【黄毛动向追踪】区块维持每个黄毛的状态连续性——', to: '**黄毛动向追踪是跨轮记忆的补充**：判定任务配合黄毛表使用（黄毛表仍为型体设定/锁定状态/淫妻线进度的权威源），同时靠【黄毛动向追踪】区块维持每个黄毛的跨轮动向连续性——' },
  // 2. S2-MSG2 锁定/线状态：不查表判断 → 与黄毛表兼容判定
  { from: '**已有黄毛、锁定与线状态一律以追踪区块为准，不查表判断**', to: '**已有黄毛、锁定与线状态以追踪区块为准（动向连续性），与黄毛表兼容判定**（型体设定/锁定状态/淫妻线进度以黄毛表为权威源——追踪区块与查表并行使用）' },
  // 3. S3-MSG15 型体/性器官规则：不查表判断 → 黄毛表权威
  { from: '运行期线状态/锁定/型体概要/性器官规则以追踪区块与历史刷新记录为准，不从前文猜、不查表判断状态', to: '运行期线状态/锁定以追踪区块与历史刷新记录为准；型体概要/性器官规则以黄毛表为权威源（配合查表），不从前文猜' },
  // 4. S2-MSG0 对象追踪句尾补 no_spawn 联动
  { from: '供黄毛尾随/赶赴判定与 S3 场景外/回归编排衔接。', to: '供黄毛尾随/赶赴判定与 S3 场景外/回归编排衔接。**即便本轮 no_spawn，追踪中黄毛保有接近离场对象的动向（尾随/赶赴/潜伏接近）即可判 act**：与【对象动向追踪】联动（对象离场动向 + 黄毛尾随动向 = 场景外 act 依据，行动发生在 {{user}} 场景外）。' },
];

let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  let n = 0;
  const miss = [];
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = apply(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = apply(v); } else walk(v); }
  }
  function apply(s) {
    let t = s;
    for (let i = 0; i < FIXES.length; i++) {
      const f = FIXES[i];
      if (t.includes(f.from)) { t = t.split(f.from).join(f.to); n++; } else miss.push(i + 1);
    }
    return t;
  }
  walk(j);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const ok = blob.includes('配合黄毛表使用') && blob.includes('与黄毛表兼容判定') && blob.includes('型体概要/性器官规则以黄毛表为权威源') && blob.includes('即便本轮 no_spawn，追踪中黄毛保有接近离场对象的动向');
  const oldGone = !blob.includes('不读表格') && !blob.includes('不查表判断');
  const realMiss = miss.filter(x => !['4'].includes(String(x))); // FIX 4 的 from 也含于被 FIX 3 改过的串? 独立检查
  console.log(fn + ' | 替换=' + n + ' ' + (ok && oldGone ? 'OK' : '[FAIL] miss:' + [...new Set(miss)].join(',') + ' ok=' + ok + ' oldGone=' + oldGone));
  if (!ok || !oldGone) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
