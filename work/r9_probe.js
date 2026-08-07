const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('has \\r:', raw.includes('\r'));
console.log('total len:', raw.length);

const probes = [
  ['B1 prologue 快速通道', 'prologue：仅一行「跟随{{user}}输入的主线走'],
  ['B1 alt(no {{user}})', '仅一行「跟随{{user}}输入的主线走'],
  ['B2 暗线戏', '属 📹 事后知情或 🌙 完全不知的暗线戏'],
  ['B3 锁定指令 ALLin', '锁定指令：锁定 [新增目标名]'],
  ['B3 S2 thugSpawn 标签内', '标签内只放刷新状态+黄毛人设'],
  ['B4 上轮% 权威源', '上轮阶段名+上轮%'],
  ['B4b 上轮% 简版', '上轮% 从概览/前文/上轮 stage 读'],
  ['B5 可行动判断', '判断该黄毛本轮是否可行动'],
  ['B7 锁定目标列表非空', '锁定目标列表非空'],
  ['B7 锁定目标列表为空', '锁定目标列表为空'],
  ['B9 After thugAction', 'After <thugAction>, output ONE tag'],
  ['B9 紧接在 thugAction', '紧接在 <thugAction>'],
  ['B10 真正锁定（NEW含）', '锁定状态字段=真正锁定'],
  ['B10 仅背景板（NEW含）', '锁定状态字段=仅背景板'],
];

for (const [label, needle] of probes) {
  let idx = 0, count = 0;
  while (true) {
    const at = raw.indexOf(needle, idx);
    if (at === -1) break;
    count++;
    const before = raw.slice(Math.max(0, at - 60), at);
    const after = raw.slice(at, Math.min(raw.length, at + needle.length + 80));
    console.log('--- ' + label + ' #' + count + ' @' + at);
    console.log('BEFORE: ' + JSON.stringify(before.replace(/\r/g, '\\r').replace(/\n/g, '\\n').slice(-90)));
    console.log('MATCH : ' + JSON.stringify(after.replace(/\r/g, '\\r').replace(/\n/g, '\\n')));
    idx = at + needle.length;
  }
  console.log('>> ' + label + ' count=' + count);
}
