const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];

const anchors = {
  'item1_spawn_措辞': '接下来的场景中该黄毛是否有出现的可能',
  'item2_HARDRULE1': '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定、不参与刷新、不误判为未绑定',
  'item4_八题自检': '本节登场角色分析、八题自检、sparkNotes 一律跳过',
  'item5_快速通道prologue': '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
  'item6_自检8d': '黄毛是否已写入 prologue 登场角色名单？雄竞期标注"竞争者·[五型]"，并标线状态？',
  'item6_8d_alt': '雄竞期标注"竞争者·[五型]"，并标线状态？',
  'item7_状态机黄毛败': '该对象线**闭合**：对象与黄毛变成好朋友，黄毛接受败局退居朋友位、不再有行动判定；{{user}} 与对象正常恋爱（纯爱线）。',
  'item7_alt_闭合': '不再有行动判定；{{user}} 与对象正常恋爱（纯爱线）。',
  'item8_ntrsProgress': '<plot> 内是否出现 <ntrsProgress> 或任何进度标签？',
  'item9_明面竞争': '👁️ **明面竞争**',
  'item10_thugSpawn标注': '**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）**',
  'item13_规则1b': '**规则 1b**',
  'item14_快速通道尾': '恢复完整导演分析。**【用户本轮输入】**',
  'item14_alt': '分析。**【用户本轮输入】**',
};

function findAll(blob, needle) {
  const out = [];
  let idx = blob.indexOf(needle);
  while (idx !== -1) {
    out.push(idx);
    idx = blob.indexOf(needle, idx + 1);
  }
  return out;
}

// scan per location: whole preset blob with task labels
const locations = [];
locations.push({ label: 'T0', blob: JSON.stringify(p.plotTasks[0]) });
locations.push({ label: 'T1', blob: JSON.stringify(p.plotTasks[1]) });
locations.push({ label: 'T2', blob: JSON.stringify(p.plotTasks[2]) });
locations.push({ label: 'FSD', blob: JSON.stringify(p.finalSystemDirective || '') });
locations.push({ label: 'TOP-PG', blob: JSON.stringify(p.promptGroup) });

for (const [name, needle] of Object.entries(anchors)) {
  const hits = [];
  for (const loc of locations) {
    const idxs = findAll(loc.blob, needle);
    for (const i of idxs) hits.push({ loc: loc.label, idx: i });
  }
  if (hits.length === 0) {
    console.log(`${name}: NOT FOUND (${needle.length} chars)`);
  } else {
    for (const h of hits) {
      const loc = locations.find(l => l.label === h.loc);
      const start = Math.max(0, h.idx - 10);
      const ctx = JSON.stringify(loc.blob.slice(start, h.idx + needle.length + 10));
      console.log(`${name}: FOUND x${hits.length} in ${h.loc} @${h.idx} ctx=${ctx.slice(0, 160)}`);
    }
  }
}
