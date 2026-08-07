// Apply fix_spec_r11 items 1-12 (FT variant) to Cirno_BATTLE_Turn_FT.json
// In-place edit on parsed JSON; write back JSON.stringify(j, null, 2).
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';

const raw0 = fs.readFileSync(path, 'utf8');
const size0 = Buffer.byteLength(raw0, 'utf8');
const j = JSON.parse(raw0);
if (!Array.isArray(j) || j.length !== 1) throw new Error('top-level not a single-element array');
const o = j[0];

// Collect all mutable string fields (obj[key] assignment via setter)
const blobs = [];
o.plotTasks.forEach((t, ti) => {
  t.promptGroup.forEach((m, mi) => {
    blobs.push({
      label: `plotTasks[${ti}].${t.id}.promptGroup[${mi}].content`,
      get: () => String(m.content),
      set: (v) => { m.content = v; },
    });
  });
});
blobs.push({ label: 'finalSystemDirective', get: () => String(o.finalSystemDirective), set: (v) => { o.finalSystemDirective = v; } });

// items: [tag, old, new]
const items = [
  ['1', '有没有尚无黄毛的角色，**接下来的场景中该黄毛是否有出现的可能**（有出场契机/进入画面路径/互动机会）？只是"存在"而无出场可能（同楼住户/无关联）→ 不空刷新',
        '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新'],
  ['2', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定、不参与刷新、不误判为未绑定',
        '线已定对象（黄毛胜·终局=线锁定非闭合、仅不再刷新新黄毛 / 黄毛败·友好=线闭合）视为仍绑定、不参与刷新、不误判为未绑定'],
  ['3', '黄毛胜·终局：对象嫁黄毛、线闭合',
        '黄毛胜·终局：对象嫁黄毛、**线锁定非闭合**（黄毛仍追踪、夫妻戏可持续）'],
  ['4', '本节登场角色分析、八题自检、sparkNotes 一律跳过',
        '本节登场角色分析、九题自检、sparkNotes 一律跳过'],
  ['5', '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
        '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若场上存在已闭合（黄毛败·友好）对象，附一行该对象的朋友级日常互动；若场上存在后宫线对象，附一行后宫互动**）'],
  ['6', '雄竞期标注"竞争者·[五型]"，并标线状态？',
        '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？'],
  ['7', '不再有行动判定；{{user}} 与对象正常恋爱（纯爱线）。',
        '不再有行动判定（**男娘系黄毛除外**：黄毛败·友好为天意·后宫线过渡态，S2 判 act 推进投怀戏——本版全员男娘系，无正常男性分支）；{{user}} 与对象正常恋爱（纯爱线）。'],
  ['7note', '黄毛败·友好线闭合不再判定',
        '黄毛败·友好线闭合不再判定（男娘系除外，判 act 推进投怀戏）'],
  ['8', '<plot> 内是否出现 <ntrsProgress> 或任何进度标签？',
        '<plot> 内是否出现任何进度标签？'],
  ['9', '👁️ **明面竞争**',
        '👁️ **明面竞争（在场见证）**'],
  ['10', '黄毛人设（会经 FSD 给花火·正文）；理由必须放在',
        '黄毛人设（会经 FSD 给花火·正文）——刷新状态/线状态/锁定状态为下游调度字段，正文 AI 忽略即可，人设字段才用于正文；理由必须放在'],
  ['11', '- Log：仅一行「no-act，快速通道输出」',
        '- Log：仅一行「no-act，快速通道输出」（本版无进度标签，不涉及进度省略）'],
  ['12a', '黄毛败·友好的正常男性后续轮回归 no-act（线闭合）',
        '本版全员男娘系无正常男性分支——黄毛败·友好（天意待触发）后续轮继续判 act 推投怀戏（线闭合仅指彻底退场，正常男性分支不存在）'],
  ['12b', '正常男性/其他败·友好黄毛按剧情自然可淡出',
        '其他败·友好黄毛按剧情自然可淡出（本版全员男娘系，无正常男性分支）'],
];

const results = [];
for (const [tag, oldStr, newStr] of items) {
  let total = 0;
  const hits = [];
  for (const b of blobs) {
    const c = b.get();
    let idx = c.indexOf(oldStr);
    while (idx !== -1) {
      total++;
      hits.push(b.label);
      idx = c.indexOf(oldStr, idx + oldStr.length);
    }
  }
  if (total === 0) {
    results.push({ tag, found: false, count: 0, where: null });
    continue;
  }
  // apply to FIRST occurrence (each anchor expected exactly 1×)
  for (const b of blobs) {
    const c = b.get();
    if (c.includes(oldStr)) {
      b.set(c.replace(oldStr, newStr)); // single replacement, keep original blob object
      break;
    }
  }
  results.push({ tag, found: true, count: total, where: hits });
}

// write back
const out = JSON.stringify(j, null, 2);
fs.writeFileSync(path, out, 'utf8');
const size1 = Buffer.byteLength(out, 'utf8');

// report
console.log('=== APPLY REPORT ===');
for (const r of results) {
  console.log(`${r.found ? 'OK ' : 'MISS'} item ${r.tag}: count=${r.count} ${r.where ? '-> ' + r.where.join(',') : ''}`);
}
console.log('size0:', size0, 'size1:', size1, 'delta:', size1 - size0);
