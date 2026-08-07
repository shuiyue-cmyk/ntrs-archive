// R14 OBS 全修：F1/F2 NTRS12 系模板槽位+S3消费（24 文件）；F3-F9 _2ALL 补充（15 文件）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const n12 = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_NTRS_turn_edit') && !f.includes('bak'));
const all2 = fs.readdirSync(dir).filter(f => f.endsWith('_2ALL.json') && !f.includes('bak'));
const battle2 = all2.filter(f => f.startsWith('Cirno_BATTLE_Turn'));

// F1: NTRS12 m4 模板槽位说明（格式区开头）
const F1_ANCHOR = '格式（spawn - 分支A';
const F1_TEXT = '**thugSpawn 内附【对象动向追踪】行**：仅离场对象（在场对象不追踪），每对象一行——`- [对象名]：位置=[离场·[去向]]；状态=[独处/社交/外出/在家/工作等]`；no_spawn 轮有离场对象时同样输出。\n\n';
// F2: NTRS12 S3 显式消费
const F2_ANCHOR = '不在 thugSpawn 标签里找）';
const F2_TEXT = '\n【对象动向追踪】每个离场的已登场💔对象动向（位置+状态，一行/对象）——仅对象离场时追踪（在场对象不追踪）；离场对象不静止（场景外动向戏/回归契机），你须照其编排：';
// F3: _2ALL 进度封顶
const F3_ANCHOR = '骚扰者互动作为触发事件计入 +0~5%/轮（同淫妻线推进规则）；100%=完全人尽可夫（无差别接受）。';
const F3_TEXT = '骚扰者互动作为触发事件计入进度——**每轮所有骚扰者合计仍按 +0~5%/轮封顶**（同淫妻线推进规则，防进度膨胀）；100%=完全人尽可夫（无差别接受）。';
// F4a: BATTLE NTRS _2ALL 亲密开局路径显式
const F4_ANCHOR = '**【乐享型·人尽可夫（_2ALL 专属设定）】**（对象淫妻线进入乐享型（86-100%）后激活）';
const F4_TEXT = '**【乐享型·人尽可夫（_2ALL 专属设定）】**（对象淫妻线进入乐享型（86-100%）后激活——含 NTRS期·亲密开局路径：对象走完低接受度五阶段至乐享即同样激活）';
// F5: _2ALL prologue 禁术语补新词
const F5_ANCHOR = '"默契型"等系统术语。';
const F5_TEXT = '"默契型""人尽可夫""骚扰者"等系统术语。';
// F6-9: _2ALL 补充细则（R13 段尾追加）
const F6_ANCHOR = '男对象/男娘对象遭遇性骚扰同理编排）。';
const F6_TEXT = '男对象/男娘对象遭遇性骚扰同理编排）。\n**人尽可夫补充细则**：\n- 进度封顶：每轮所有骚扰者互动合计仍按 +0~5%/轮封顶（同淫妻线推进规则，防进度膨胀）。\n- 场景约束：骚扰以公共/半公共场景自然发生为主；对象独处/在家时被尾随上门骚扰须有合理剧情铺垫（非默认）。\n- 多目标：一黄毛多目标（ALLin）时，0-N 骚扰者按每个乐享型对象各自独立刷新，人尽可夫逐对象成立。\n- 避让门：骚扰者互动不受黄毛「亲密互动避让门」约束（对象乐享型人尽可夫，不因 {{user}} 在场而避让）。\n- 登场处理：骚扰者按临时角色处理——计入登场名单时 cast/plot 以轻量一行覆盖（身份+骚扰行为），不占主角色分析深度。';

let fail = 0;
// NTRS 12 系 24 文件：F1 + F2
for (const fn of n12) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  let n = 0, miss = [];
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = applyN(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = applyN(v); } else walk(v); }
  }
  function applyN(s) {
    let t = s;
    if (t.includes(F1_ANCHOR)) { t = t.split(F1_ANCHOR).join(F1_TEXT + F1_ANCHOR); n++; } else miss.push('F1');
    if (t.includes(F2_ANCHOR)) { t = t.split(F2_ANCHOR).join(F2_ANCHOR + F2_TEXT); n++; } else miss.push('F2');
    return t;
  }
  walk(j);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const ok = blob.includes('thugSpawn 内附【对象动向追踪】行') && blob.includes('每个离场的已登场💔对象动向');
  console.log(fn + ' | ' + n + ' ' + (ok && miss.length === 0 ? 'OK' : '[FAIL' + (miss.length ? ' miss:' + miss.join(',') : '') + ']'));
  if (!ok || miss.length) fail++;
}
// _2ALL 15 文件：F3 + F5 + F6 (+F4a 仅 BATTLE)
for (const fn of all2) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  let n = 0, miss = [];
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = applyA(v); } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = applyA(v); } else walk(v); }
  }
  function applyA(s) {
    let t = s;
    if (t.includes(F3_ANCHOR)) { t = t.split(F3_ANCHOR).join(F3_TEXT); n++; } else miss.push('F3');
    if (t.includes(F5_ANCHOR)) { t = t.split(F5_ANCHOR).join(F5_TEXT); n++; } else miss.push('F5');
    if (t.includes(F6_ANCHOR)) { t = t.split(F6_ANCHOR).join(F6_TEXT); n++; } else miss.push('F6');
    if (battle2.includes(fn) && t.includes(F4_ANCHOR)) { t = t.split(F4_ANCHOR).join(F4_TEXT); n++; } else if (battle2.includes(fn)) miss.push('F4a');
    return t;
  }
  walk(j);
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  const ok = blob.includes('每轮所有骚扰者合计仍按 +0~5%/轮封顶') && blob.includes('人尽可夫补充细则') && blob.includes('"人尽可夫""骚扰者"等系统术语') && (!battle2.includes(fn) || blob.includes('含 NTRS期·亲密开局路径'));
  console.log(fn + ' | ' + n + ' ' + (ok && miss.length === 0 ? 'OK' : '[FAIL' + (miss.length ? ' miss:' + miss.join(',') : '') + ']'));
  if (!ok || miss.length) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
