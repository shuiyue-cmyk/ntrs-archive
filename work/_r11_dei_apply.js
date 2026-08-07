const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);

// sanity: top-level array, single object
if (!Array.isArray(j) || j.length !== 1) throw new Error('top-level not array');

const p = j[0];
const tasks = (p.plotTasks || []);

// --- replacement pairs (DEI variant) ---
const edits = [
  { id: 'item1', old: '有没有尚无黄毛的角色，**接下来的场景中该黄毛是否有出现的可能**（有出场契机/进入画面路径/互动机会）？只是"存在"而无出场可能（同楼住户/无关联）→ 不空刷新',
    next: '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新' },
  { id: 'item2', old: '**线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定、不参与刷新、不误判为未绑定**',
    next: '**线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定**' },
  { id: 'item4', old: '本节登场角色分析、八题自检、sparkNotes 一律跳过',
    next: '本节登场角色分析、九题自检、sparkNotes 一律跳过' },
  { id: 'item5', old: '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
    next: '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动；若场上存在后宫线对象，附一行后宫互动**）' },
  { id: 'item6', old: '雄竞期标注"竞争者·[五型]"，并标线状态？',
    next: '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？' },
  { id: 'item7', old: '该对象线**闭合**：对象与黄毛变成好朋友，黄毛接受败局退居朋友位、不再有行动判定；{{user}} 与对象正常恋爱（纯爱线）。',
    next: '该对象线**闭合**：对象与黄毛变成好朋友，黄毛接受败局退居朋友位、不再有行动判定（**男娘系黄毛除外**：黄毛败·友好为天意·后宫线过渡态，S2 判 act 推进投怀戏；正常男性黄毛不触发天意，按线闭合处理）；{{user}} 与对象正常恋爱（纯爱线）。' },
  { id: 'item8', old: '<plot> 内是否出现 <ntrsProgress> 或任何进度标签？',
    next: '<plot> 内是否出现任何进度标签？' },
  { id: 'item9', old: '👁️ **明面竞争**',
    next: '👁️ **明面竞争（在场见证）**' },
  { id: 'item10', old: '（会经 FSD 给花火·正文）；理由必须放在紧随其后的',
    next: '（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文；理由必须放在紧随其后的' },
  { id: 'item13a', old: '1b. **线状态=黄毛胜·终局**',
    next: '1-b. **线状态=黄毛胜·终局**' },
  { id: 'item13b', old: '见规则 1b',
    next: '见规则 1-b' },
  { id: 'item14', old: '恢复完整导演分析。【用户本轮输入】**',
    next: '恢复完整导演分析。**【用户本轮输入】**' },
];

// gather all content strings (plotTasks + top-level promptGroup + FSD as fallback)
const containers = [];
for (const t of tasks) (t.promptGroup || []).forEach(m => containers.push({ loc: `${t.id} promptGroup`, msg: m }));
(p.promptGroup || []).forEach(m => containers.push({ loc: 'top promptGroup', msg: m }));
containers.push({ loc: 'finalSystemDirective', msg: { content: p.finalSystemDirective || '' } });

let totalApplied = 0;
for (const e of edits) {
  let hits = 0;
  let hitLocs = [];
  for (const c of containers) {
    const content = c.msg.content || '';
    const count = content.split(e.old).length - 1;
    if (count > 0) { hits += count; hitLocs.push({ loc: c.loc, count }); }
  }
  if (hits === 0) {
    console.log(`${e.id}: ANCHOR NOT FOUND`);
    continue;
  }
  if (hits > 1) {
    console.log(`${e.id}: MULTIPLE (${hits}) — SKIPPED, manual check needed. locs:`, JSON.stringify(hitLocs));
    continue;
  }
  // apply on the single container
  for (const c of containers) {
    if ((c.msg.content || '').includes(e.old)) {
      c.msg.content = c.msg.content.split(e.old).join(e.next);
      console.log(`${e.id}: applied x1 in ${c.loc}`);
      totalApplied++;
      break;
    }
  }
}

console.log(`\ntotal applied: ${totalApplied}/${edits.length}`);

// write back — keep original j (array top level)
const out = JSON.stringify(j, null, 2);
if (!out.startsWith('[')) throw new Error('write-back top level is NOT array!');
fs.writeFileSync(path, out, 'utf8');
console.log('written. new size:', Buffer.byteLength(out, 'utf8'), 'old size:', Buffer.byteLength(raw, 'utf8'));
