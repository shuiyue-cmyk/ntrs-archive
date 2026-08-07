const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const blob = JSON.stringify(j);

const specs = {
  I1: '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新',
  I2: '线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定',
  I4: '本节登场角色分析、九题自检、sparkNotes 一律跳过',
  I5: '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动**）',
  I6: '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？',
  I9: '👁️ **明面竞争（在场见证）**',
  I10: '<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文',
};

function diff(a, b) {
  for (let n = 0; n < Math.max(a.length, b.length); n++) {
    if (a[n] !== b[n]) return { pos: n, actual: a[n] === undefined ? '<EOF>' : a[n], want: b[n] === undefined ? '<EOF>' : b[n], actualCC: a.charCodeAt(n), wantCC: b.charCodeAt(n) };
  }
  return null;
}

for (const [label, s] of Object.entries(specs)) {
  const idx = blob.indexOf(s);
  if (idx >= 0) { console.log('[OK] ' + label + ' present, idx=' + idx); continue; }
  // find partial match: locate a stable prefix
  const prefix = s.slice(0, 20);
  const p = blob.indexOf(prefix);
  if (p >= 0) {
    console.log('[DIFF] ' + label + ' prefix found at ' + p + ', divergence: ' + JSON.stringify(diff(blob.slice(p, p + s.length + 30), s)));
  } else {
    // scan for nearest occurrence char-agnostic
    console.log('[MISS] ' + label + ' not found at all (prefix=' + prefix + ' not found)');
  }
}
