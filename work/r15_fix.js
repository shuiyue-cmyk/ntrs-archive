// R15：NTRS 12 系 24 文件加【黄毛动向追踪】（兼容查表）+ 与对象追踪联动 no_spawn 可 act
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_NTRS_turn_edit') && !f.includes('bak'));

// S2-MSG0：对象追踪句尾追加黄毛动向追踪说明
const S0_ANCHOR = '供黄毛尾随判定与 S3 场景外/回归编排衔接。';
const S0_NEW = '供黄毛尾随判定与 S3 场景外/回归编排衔接。**thugSpawn 内同时输出【黄毛动向追踪】**（兼容查表，不替换）：黄毛表仍为型体设定/锁定状态/淫妻线进度的权威源；追踪区块负责每个已刷新黄毛的**动向连续性**（每轮必列：动向=[在场·[位置] / 离场·[去向] / 尾随·[对象名] / 暗中布局]；锁定状态=[真正锁定/背景板]；进度=[X%]）——**即便本轮 no_spawn，追踪中黄毛保有接近离场对象的动向（尾随/赶赴/潜伏接近）即可判 act**：与【对象动向追踪】联动（对象离场动向 + 黄毛尾随动向 = 场景外 act 依据，行动发生在 {{user}} 场景外）。';

// m4：F1 说明句尾追加黄毛动向追踪区块示例
const M4_ANCHOR = 'no_spawn 轮有离场对象时同样输出。';
const M4_NEW = 'no_spawn 轮有离场对象时同样输出。\n**thugSpawn 内附【黄毛动向追踪】区块**（兼容查表：黄毛表仍为型体设定/锁定状态/进度权威源；追踪区块负责动向连续性，每轮必列所有已刷新黄毛，no_spawn 轮同样列出）：\n`【黄毛动向追踪】\n- [黄毛名]（锁定目标 [对象名]）：动向=[在场·[位置] / 离场·[去向] / 尾随·[对象名] / 暗中布局]；锁定状态=[真正锁定/背景板]；进度=[X%]`';

let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = apply(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = apply(v); } else walk(v); }
  }
  function apply(s) {
    let t = s;
    if (t.includes(S0_ANCHOR)) { t = t.split(S0_ANCHOR).join(S0_NEW); n++; }
    if (t.includes(M4_ANCHOR)) { t = t.split(M4_ANCHOR).join(M4_NEW); n++; }
    return t;
  }
  walk(j);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const s0 = blob.includes('thugSpawn 内同时输出【黄毛动向追踪】');
  const s0act = blob.includes('即便本轮 no_spawn，追踪中黄毛保有接近离场对象的动向');
  const m4 = blob.includes('thugSpawn 内附【黄毛动向追踪】区块');
  const ok = s0 && s0act && m4;
  console.log(fn + ' | 替换=' + n + ' S0=' + (s0 && s0act) + ' m4=' + m4 + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok || n !== 2) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
