// R16 修复：P0 追踪分级（33 文件）+ P1 NTRS·雄竞苦主视角/第三阶段（6 文件）+ P2 察觉迎合（NTRS12 24 文件）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));

const P0A_OLD = '⚠️ **追踪区块必须每轮输出**（黄毛追踪不依赖表格注入，每轮必列所有已刷新黄毛——即使动向/线状态与上轮相同也须完整列出，维持跨轮记忆；';
const P0A_NEW = '⚠️ **追踪区块每轮输出（按判定状态分级）**（黄毛追踪不依赖表格注入，每轮必列所有已刷新黄毛——**无判定（no-act）轮极简**：仅列动向+线状态一行维持跨轮记忆，不展开型体概要/性器官等冗余；**能合理判定场外 act 时丰富**：详列接近途径/尾随对象等可供 S3 场景外编排的细节；**no_spawn 的 act 须逻辑无硬伤门完整严谨判定**；';

const P0B_OLD = '追踪区块负责每个已刷新黄毛的**动向连续性**（每轮必列：动向=[在场·[位置] / 离场·[去向] / 尾随·[对象名] / 暗中布局]；锁定状态=[真正锁定/背景板]；进度=[X%]）';
const P0B_NEW = '追踪区块负责每个已刷新黄毛的**动向连续性**（每轮必列，**按判定状态分级**——无判定（no-act）轮极简：仅动向+锁定状态+进度一行；能合理判定场外 act 时丰富：详列尾随对象/接近途径供 S3 编排；no_spawn 的 act 须逻辑无硬伤门完整严谨判定：动向=[在场·[位置] / 离场·[去向] / 尾随·[对象名] / 暗中布局]；锁定状态=[真正锁定/背景板]；进度=[X%]）';

const P1C_OLD = '- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系。';
const P1C_NEW = '- **黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛——接受表白/确立关系/成婚）——该对象线**终局锁定**：对象与 {{user}} 关系封顶「好朋友」，与黄毛成为真正夫妻级亲密关系——**编排参考传统 NTR：user=苦主（旁观对象与黄毛的亲密互动）、对象=女主、黄毛=牛头人；对象不拒 user 互动但仅朋友级，亲密只属黄毛**。';

const P1E_OLD = '本版淫妻线从察觉型（41%）起步';
const P1E_NEW = '本版淫妻线从察觉型（41%，即第三阶段）起步';

const P2F_OLD = '敏感对象察觉 {{user}} 的淫妻癖好后，会主动尝试避开 {{user}} 与黄毛单独相处';
const P2F_NEW = '敏感对象在黄毛行动过程中**察觉 {{user}} 的淫妻癖好并开始迎合**（察觉迎合：接受黄毛互动、主动配合），会主动尝试避开 {{user}} 与黄毛单独相处';

let fail = 0;
for (const fn of files) {
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  const isHyb = isB && fn.includes('_NTRS');
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  const pairs = [];
  if (isB) pairs.push([P0A_OLD, P0A_NEW]);
  if (isN) pairs.push([P0B_OLD, P0B_NEW]);
  if (isHyb) { pairs.push([P1C_OLD, P1C_NEW]); pairs.push([P1E_OLD, P1E_NEW]); }
  if (isN) pairs.push([P2F_OLD, P2F_NEW]);
  let n = 0; const miss = [];
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = apply(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = apply(v); } else walk(v); }
  }
  function apply(s) {
    let t = s;
    for (const [from, to] of pairs) {
      if (t.includes(from)) { t = t.split(from).join(to); n++; } else miss.push(from.slice(0, 12));
    }
    return t;
  }
  walk(j);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const expN = pairs.length;
  const ok = n === expN;
  console.log(fn + ' | 预期=' + expN + ' 实改=' + n + ' ' + (ok ? 'OK' : '[FAIL] miss:' + [...new Set(miss)].join('|')));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
