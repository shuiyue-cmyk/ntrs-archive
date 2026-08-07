const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('raw.trim().startsWith("["):', raw.trim().startsWith('['));
const j = JSON.parse(raw);
console.log('top-level Array:', Array.isArray(j));
const p = j[0];
console.log('has plotTasks:', Array.isArray(p.plotTasks), '| tasks:', p.plotTasks ? p.plotTasks.length : 0);
console.log('finalSystemDirective len:', (p.finalSystemDirective || '').length);

// collect fields
const fields = [];
if (Array.isArray(p.plotTasks)) {
  for (const t of p.plotTasks) {
    if (typeof t.description === 'string' && t.description) fields.push({ loc: `task[${t.id}].description`, s: t.description });
    if (Array.isArray(t.promptGroup)) {
      t.promptGroup.forEach((m, i) => {
        if (typeof m.content === 'string') fields.push({ loc: `task[${t.id}].promptGroup[${i}]`, s: m.content });
      });
    }
  }
}
if (typeof p.finalSystemDirective === 'string') fields.push({ loc: 'j[0].finalSystemDirective', s: p.finalSystemDirective });

const olds = {
  'B1_OLD': '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
  'B2_OLD': '属 📹 事后知情或 🌙 完全不知的暗线戏',
  'B3_OLD': '- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增',
  'B4a': '上轮阶段名+上轮% 从概览/前文/上轮 stage 读',
  'B4b': '上轮% 从概览/前文/上轮 stage 读',
  'B5a': '判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）',
  'B5b': '判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn',
  'B7_1': ' - thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。',
  'B7_2': ' - thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）',
  'B3b(会经 FSD)': '会经 FSD',
  'B10_anchor(锁定状态字段)': '锁定状态字段',
  '仅一行(其他prologue)': '仅一行',
};

for (const [k, o] of Object.entries(olds)) {
  let total = 0;
  const hits = [];
  for (const f of fields) {
    const n = f.s.split(o).length - 1;
    if (n > 0) { total += n; hits.push({ loc: f.loc, n }); }
  }
  console.log(`\n== ${k} => total ${total}`);
  for (const h of hits) console.log('   hit:', h.loc, 'x', h.n);
  if (total > 0) {
    const f0 = fields.find(f => f.s.includes(o));
    const idx = f0.s.indexOf(o);
    console.log('   first ctx:', JSON.stringify(f0.s.slice(Math.max(0, idx - 80), Math.min(f0.s.length, idx + o.length + 120))));
  }
}

// B7 context: dump the full T2 登场门 paragraph around first 锁定目标列表
for (const f of fields) {
  const idx = f.s.indexOf('锁定目标列表');
  if (idx >= 0) {
    console.log('\n== full ctx around 锁定目标列表 (loc ' + f.loc + '):');
    console.log(JSON.stringify(f.s.slice(Math.max(0, idx - 700), idx + 700)));
    break;
  }
}

// B4 context
for (const f of fields) {
  const idx = f.s.indexOf('上轮%');
  if (idx >= 0) {
    console.log('\n== ctx around 上轮% (loc ' + f.loc + '):');
    console.log(JSON.stringify(f.s.slice(Math.max(0, idx - 400), idx + 400)));
    break;
  }
}

// B3 template context (维持背景板 [目标名] / 无新增)
for (const f of fields) {
  const idx = f.s.indexOf('无新增');
  if (idx >= 0) {
    console.log('\n== ctx around 无新增 (loc ' + f.loc + '):');
    console.log(JSON.stringify(f.s.slice(Math.max(0, idx - 600), idx + 200)));
    break;
  }
}

// B3 second part: S2 判定段 sentence about 会经 FSD
for (const f of fields) {
  const idx = f.s.indexOf('会经 FSD');
  if (idx >= 0) {
    console.log('\n== ctx around 会经 FSD (loc ' + f.loc + '):');
    console.log(JSON.stringify(f.s.slice(Math.max(0, idx - 300), idx + 300)));
  }
}
