// R7 补修 2：FT「明确且长期拒绝」漏修位 + NTRS 三分支A/B 多黄毛门控同步
const fs = require('fs');
const DIR = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';

const jobs = [
  // FT plain：S3-MSG2「黄毛败·友好编排」段漏修位
  {
    file: 'Cirno_BATTLE_Turn_FT.json',
    pairs: [
      [
        `对象明确且长期拒绝黄毛、或明确选择 {{user}}——该对象线**闭合**，黄毛退出竞争：`,
        `综合判断女主行为已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}）——该对象线**闭合**，黄毛退出竞争：`,
        'FT-L667',
      ],
    ],
  },
  // NTRS 三分支A/B 多黄毛门控（同纯雄竞 S1f/S2h/S3i 改法）
  {
    file: 'Cirno_BATTLE_Turn_straight_NTRS.json',
    pairs: [
      [
        `存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入【黄毛动向追踪】并判断其本轮是否可行动（见"刷新状态两档"）。`,
        `存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛，改为把该黄毛本轮动向列入【黄毛动向追踪】并判断其本轮是否可行动（见"刷新状态两档"）。`,
        'SN-branchA',
      ],
      [
        `【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
        `【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。`,
        'SN-branchB',
      ],
    ],
  },
  {
    file: 'Cirno_BATTLE_Turn_FT_NTRS.json',
    pairs: [
      [
        `存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入【黄毛动向追踪】并判断其本轮是否可行动（见"刷新状态两档"）。`,
        `存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛，改为把该黄毛本轮动向列入【黄毛动向追踪】并判断其本轮是否可行动（见"刷新状态两档"）。`,
        'FN-branchA',
      ],
      [
        `【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
        `【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。`,
        'FN-branchB',
      ],
    ],
  },
  {
    file: 'Cirno_BATTLE_Turn_DEI_NTRS.json',
    pairs: [
      [
        `存在即视为"该目标已绑定黄毛"，一气到底不再刷新新黄毛，改为把该黄毛本轮动向列入【黄毛动向追踪】并判断其本轮是否可行动（见"刷新状态两档"）。`,
        `存在即视为"该目标已绑定黄毛"，该目标不再刷新新黄毛，改为把该黄毛本轮动向列入【黄毛动向追踪】并判断其本轮是否可行动（见"刷新状态两档"）。`,
        'DN-branchA',
      ],
      [
        `【分支 B — 无追踪黄毛】：场上尚无任何已刷新黄毛（或所有黄毛均已终局闭合），走"黄毛刷新判定"逻辑判定本轮是否为某💔可攻略角色刷新一个新黄毛。`,
        `【分支 B — 有待刷新目标】：场上存在**尚未绑定黄毛**的💔可攻略目标（无论场上是否已有其他黄毛在追踪），对其走"黄毛刷新判定"逻辑判定本轮是否为该目标刷新一个新黄毛；已有追踪黄毛的目标走分支A 追踪写法。`,
        'DN-branchB',
      ],
    ],
  },
];

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

for (const job of jobs) {
  const fp = DIR + '/' + job.file;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const p = Array.isArray(j) ? j[0] : j;
  const log = [];
  for (const t of p.plotTasks || []) {
    const pg = t.promptGroup || {};
    for (const k of Object.keys(pg)) {
      const m = pg[k];
      if (typeof m === 'object' && m && typeof m.content === 'string') {
        m.content = applyReplacements(m.content, job.pairs, log);
      } else if (typeof m === 'string') {
        pg[k] = applyReplacements(m, job.pairs, log);
      }
    }
  }
  const out = JSON.stringify(j, null, 2);
  if (!out.trimStart().startsWith('[')) {
    console.log('!!!', job.file, 'TOPLEVEL BROKEN — NOT WRITTEN');
    continue;
  }
  fs.writeFileSync(fp, out, 'utf8');
  console.log('OK', job.file, '|', log.join(' / '));
}
