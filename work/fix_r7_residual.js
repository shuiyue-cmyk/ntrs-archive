// R7 补修：S2-MSG0「黄毛胜」bullet + S3 sparkNotes 自检「不再判定」残留（P0-C 语义：终局不踢出）
const fs = require('fs');
const DIR = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';
const files = [
  'Cirno_BATTLE_Turn_straight.json',
  'Cirno_BATTLE_Turn_FT.json',
  'Cirno_BATTLE_Turn_DEI.json',
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json',
  'Cirno_BATTLE_Turn_DEI_NTRS.json',
];

// S2-MSG0 bullet（六版同 OLD，NEW 按版本分组——纯雄竞版 vs NTRS 版）
const BULLET_OLD = `判定任务输出「雄竞结果：黄毛胜」，该对象后续轮不再参与任何判定（{{user}} 转攻其他可攻略对象）。`;
const BULLET_NEW_PLAIN = `判定任务输出「雄竞结果：黄毛胜」。**黄毛不踢出追踪**：该对象线终局锁定，但黄毛仍列入【黄毛动向追踪】、后续轮仍可刷新判定互动（黄毛与对象的夫妻级亲密互动戏可持续编排）；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`;
const BULLET_NEW_NTRS = `判定任务输出「雄竞结果：黄毛胜」。**黄毛不踢出追踪**：该对象线终局锁定，但黄毛仍列入【黄毛动向追踪】、后续轮仍可刷新判定互动（黄毛与对象的夫妻级亲密互动戏可持续编排）；对象仍可在 {{user}} 身边活动、与 {{user}} 正常互动，但亲密互动只与黄毛发生，黄毛不多介入 {{user}} 的日常生活。`;

// S3 sparkNotes 自检「不再判定」残留
const SPARK_OLD_PLAIN = `（从 <thugSpawn> 线状态字段读；闭合对象不再判定）`;
const SPARK_NEW_PLAIN_ST = `（从 <thugSpawn> 线状态字段读；黄毛败·友好线闭合不再判定，黄毛胜·终局仍按追踪判定互动）`;
const SPARK_OLD_PLAIN_HD = `（从 <thugSpawn> 线状态字段读；闭合对象不再判定，后宫线对象判与 {{user}} 的后宫互动）`;
const SPARK_NEW_PLAIN_HD = `（从 <thugSpawn> 线状态字段读；黄毛败·友好线闭合不再判定，黄毛胜·终局仍按追踪判定互动，后宫线对象判与 {{user}} 的后宫互动）`;
const SPARK_OLD_NTRS = `（从 <thugSpawn> 线状态字段读；黄毛胜·终局对象不再判定）`;
const SPARK_NEW_NTRS = `（从 <thugSpawn> 线状态字段读；黄毛胜·终局对象仍按追踪判定互动——夫妻级亲密戏可持续）`;

const pairsByFile = {};
for (const fn of files) {
  const isNTRS = fn.includes('_NTRS');
  const pairs = [
    [BULLET_OLD, isNTRS ? BULLET_NEW_NTRS : BULLET_NEW_PLAIN, 'S2bullet'],
  ];
  if (isNTRS) {
    pairs.push([SPARK_OLD_NTRS, SPARK_NEW_NTRS, 'spark']);
  } else if (fn.includes('FT') || fn.includes('DEI')) {
    pairs.push([SPARK_OLD_PLAIN_HD, SPARK_NEW_PLAIN_HD, 'spark']);
  } else {
    pairs.push([SPARK_OLD_PLAIN, SPARK_NEW_PLAIN_ST, 'spark']);
  }
  pairsByFile[fn] = pairs;
}

function applyReplacements(str, pairs, log) {
  for (const [old, nw, id] of pairs) {
    if (str.includes(old)) {
      const cnt = str.split(old).length - 1;
      str = str.split(old).join(nw);
      log.push(`${id}: ${cnt} hit`);
    } else {
      log.push(`${id}: 0 hit (MISS)`);
    }
  }
  return str;
}

for (const fn of files) {
  const fp = DIR + '/' + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const p = Array.isArray(j) ? j[0] : j;
  const log = [];
  for (const t of p.plotTasks || []) {
    const pg = t.promptGroup || {};
    for (const k of Object.keys(pg)) {
      const m = pg[k];
      if (typeof m === 'object' && m && typeof m.content === 'string') {
        m.content = applyReplacements(m.content, pairsByFile[fn], log);
      } else if (typeof m === 'string') {
        pg[k] = applyReplacements(m, pairsByFile[fn], log);
      }
    }
  }
  const out = JSON.stringify(j, null, 2);
  if (!out.trimStart().startsWith('[')) {
    console.log('!!!', fn, 'TOPLEVEL BROKEN — NOT WRITTEN');
    continue;
  }
  fs.writeFileSync(fp, out, 'utf8');
  console.log('OK', fn, '|', log.join(' / '));
}
