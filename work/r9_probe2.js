const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');

function probe(label, needle, ctx = 200) {
  let idx = 0, count = 0;
  while (true) {
    const at = raw.indexOf(needle, idx);
    if (at === -1) break;
    count++;
    const before = raw.slice(Math.max(0, at - 90), at);
    const after = raw.slice(at, Math.min(raw.length, at + needle.length + ctx));
    console.log('--- ' + label + ' #' + count + ' @' + at);
    console.log('BEFORE: ' + JSON.stringify(before.replace(/\r/g, '\\r').replace(/\n/g, '\\n').slice(-110)));
    console.log('MATCH : ' + JSON.stringify(after.replace(/\r/g, '\\r').replace(/\n/g, '\\n')));
    idx = at + needle.length;
  }
  console.log('>> ' + label + ' count=' + count);
}

// B4: find the actual wording around 上轮 / progress_percent
probe('B4 progress_percent', 'progress_percent');
probe('B4 上轮%', '上轮%');
probe('B4 概览/前文', '概览/前文');
// B7: find 登场门 actual text
probe('B7 thugSpawn 状态=spawn', 'thugSpawn 状态=spawn');
probe('B7 锁定目标列表', '锁定目标列表');
probe('B7 潜在黄毛', '潜在黄毛');
probe('B7 登场角色名单', '登场角色名单');
probe('B7 真正锁定', '真正锁定');
// B1: check for second 快速通道 occurrence
probe('B1 本轮黄毛不出手', '本轮黄毛不出手', 60);
probe('B1 快速通道', '快速通道', 120);
// B3 full line leading whitespace
probe('B3 full line check', '锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]', 30);
// B5 full context
probe('B5 full', '判断该黄毛本轮是否可行动', 320);
// B9 context
probe('B9-1 full', 'After <thugAction>, output ONE tag', 160);
probe('B9-2 full', 'OUTPUT FORMAT (单标签，', 160);
// B10: look for 锁定状态 wording
probe('B10 锁定状态', '锁定状态', 120);
probe('B10 潜在黄毛[未锁定', '潜在黄毛[未锁定', 120);
