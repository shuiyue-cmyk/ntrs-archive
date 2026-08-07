// R11 验证：六版 JSON/顶层数组 + 各条目 NEW 在/OLD 清零 + 变体句残留检查
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const pure = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json'];
const hybrid = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const all = [...pure, ...hybrid];
const cnt = (s, t) => s.split(t).length - 1;
let fail = 0;
for (const fn of all) {
  const isPure = pure.includes(fn);
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const L = [];
  L.push('==== ' + fn + ' ====');
  let ok = true;
  try { JSON.parse(raw); } catch (e) { L.push('  [FAIL] JSON: ' + e.message); ok = false; fail++; }
  if (!raw.trim().startsWith('[')) { L.push('  [FAIL] top-level not array'); ok = false; fail++; }
  if (!ok) { console.log(L.join('\n')); continue; }
  const blob = JSON.stringify(JSON.parse(raw));
  const chk = (label, t, expectGone) => {
    const c = cnt(blob, t);
    if (expectGone ? c !== 0 : c === 0) { L.push('  [FAIL] ' + label + ' = ' + c); fail++; } else { L.push('  ' + label + ' = ' + c + ' OK'); }
  };
  // 六版通用
  chk('旧spawn措辞「接下来的场景中该黄毛是否有出现的可能」', '接下来的场景中该黄毛是否有出现的可能', true);
  chk('「👁️ **明面竞争**」', '👁️ **明面竞争**', true);
  chk('「👁️ **明面竞争（在场见证）**」', '👁️ **明面竞争（在场见证）**', false);
  if (isPure) {
    // 纯雄竞
    chk('「线已闭合的对象」', '线已闭合的对象', true);
    chk('「线已定对象」', '线已定对象', false);
    chk('「八题自检」', '八题自检', true);
    chk('「九题自检」', '九题自检', false);
    chk('「<ntrsProgress> 或」', '<ntrsProgress> 或', true);
    chk('「快速通道附行（已闭合对象）」', '附一行该对象的朋友级日常互动', false);
    chk('「调度字段正文不呈现」', '为下游调度字段，正文 AI 忽略即可', false);
  } else {
    // NTRS·雄竞
    chk('「即使对象已站队」', '即使对象已站队', true);
    chk('「亲情/义亲目标不豁免」', '亲情/义亲目标不豁免', true);
    chk('「计入亲密开局分流」', '计入亲密开局分流', false);
    chk('「仍按雄竞判定未豁免」', '仍按雄竞判定未豁免', true);
    chk('「首轮基线=察觉型 41%」', '首轮基线=察觉型 41%', true);
    chk('「三种线状态之一」', '三种线状态之一', true);
    chk('「四种线状态之一」', '四种线状态之一', false);
    chk('「NTRS期·亲密开局」', 'NTRS期·亲密开局', false);
    chk('「暗中（亲密开局起步）」', '暗中（亲密开局起步）', false);
    chk('「（对象已站队→亲密开局分流，见上方）」', '（对象已站队→亲密开局分流，见上方）', true);
    chk('「当前阶段（NTRS期）」五态', '忠诚型/动摇型/察觉型/默契型/乐享型', false);
    chk('「场景外📹门槛亲密开局限定」', 'NTRS期·亲密开局同此门槛', false);
    // 变体句检查
    chk('变体「对象的情感倾向影响雄竞难度」', '对象的情感倾向影响雄竞难度', true);
    chk('变体「本版淫妻线从察觉型（41%）起步」头部', '本版淫妻线从察觉型（41%）起步', false);
  }
  if (fn === 'Cirno_BATTLE_Turn_DEI.json') {
    chk('DEI TRIGGER「规则 1b」', '1b', true);
    chk('DEI TRIGGER「1-b」', '1-b', false);
    chk('DEI markdown「恢复完整导演分析。【用户本轮输入】**」', '恢复完整导演分析。【用户本轮输入】**', true);
  }
  if (fn === 'Cirno_BATTLE_Turn_FT.json') {
    chk('FT markdown 缺起始**', '恢复完整导演分析。【用户本轮输入】**', true);
    chk('FT 死分支「正常男性/其他败·友好黄毛按剧情自然可淡出」', '正常男性/其他败·友好黄毛按剧情自然可淡出', true);
    chk('FT Log 后缀', '（本版无进度标签，不涉及进度省略）', false);
  }
  if (fn === 'Cirno_BATTLE_Turn_DEI_NTRS.json') {
    chk('DEI_NTRS「不可避的XP」', '不可避的XP', true);
    chk('DEI_NTRS「不可避XP」', '不可避XP', false);
  }
  console.log(L.join('\n'));
}
console.log('\n==== 总结: ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
