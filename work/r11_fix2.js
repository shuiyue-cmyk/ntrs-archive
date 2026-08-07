// R11 收尾修复：FT markdown 缺起始 **；straight_NTRS/FT_NTRS 变体1 难度条款限自由身
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const fixes = [
  {
    fn: 'Cirno_BATTLE_Turn_FT.json',
    from: '恢复完整导演分析。【用户本轮输入】**',
    to: '恢复完整导演分析。**【用户本轮输入】**',
  },
  {
    fn: 'Cirno_BATTLE_Turn_straight_NTRS.json',
    from: '**对象的情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。',
    to: '**对象的情感倾向影响雄竞难度（仅自由身目标）**：对象对 {{user}} 有明显情感倾向（{{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。（已站队/血亲义亲目标走亲密开局分流，不适用本条）',
  },
  {
    fn: 'Cirno_BATTLE_Turn_FT_NTRS.json',
    from: '**对象的情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。',
    to: '**对象的情感倾向影响雄竞难度（仅自由身目标）**：对象对 {{user}} 有明显情感倾向（{{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。（已站队/血亲义亲目标走亲密开局分流，不适用本条）',
  },
];
let fail = 0;
for (const f of fixes) {
  const p = dir + f.fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level not array: ' + f.fn); fail++; continue; }
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string' && v.includes(f.from)) { o[i] = v.split(f.from).join(f.to); n++; } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string' && v.includes(f.from)) { o[k] = v.split(f.from).join(f.to); n++; } else walk(v); }
  }
  walk(j);
  const out = JSON.stringify(j, null, 2);
  fs.writeFileSync(p, out, 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  let ok = true;
  try { JSON.parse(back); } catch (e) { ok = false; console.log('[FAIL] JSON invalid after write: ' + f.fn); }
  if (!back.trim().startsWith('[')) { ok = false; console.log('[FAIL] top-level not array after write: ' + f.fn); }
  const remain = back.split(f.from).length - 1;
  const newCnt = back.split(f.to).length - 1;
  console.log(f.fn + ' | replaced=' + n + ' | remain=' + remain + ' | new=' + newCnt + (ok ? ' OK' : ' [FAIL]'));
  if (!ok || remain !== 0 || newCnt === 0) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
