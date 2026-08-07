// R9 PART B fix — Cirno_NTRS_turn_edit_straight_ALLin_4.7.json (original NTRS straight ALLin, 1:N, 1-space indent)
// Pairs: B1, B2, B3 (x2: 锁定指令行 + S2 判定段追加), B4, B5, B7 (x2), B10 (chained after B7a).
// In-place via obj[key] references; {[db.*]} untouched; write only if JSON.parse OK and raw starts with '['.

const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.error('FATAL: parse failed', e.message); process.exit(1); }
if (!Array.isArray(j) || !raw.trimStart().startsWith('[')) { console.error('FATAL: not top-level array'); process.exit(1); }

const pairs = [
  {
    id: 'B1',
    old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    now: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  },
  {
    id: 'B2',
    old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    now: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  },
  {
    id: 'B3-锁定指令行',
    old: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增`,
    now: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  },
  {
    id: 'B3-S2追加',
    old: `⚠️ **<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；理由必须放在紧随其后的 <thugSpawnReason> 内（只给导演读，不进 FSD）；禁止标签外「理由：」行**`,
    now: `⚠️ **<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；理由必须放在紧随其后的 <thugSpawnReason> 内（只给导演读，不进 FSD）；禁止标签外「理由：」行**（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  },
  {
    id: 'B4',
    old: ` · 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    now: ` · 上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  },
  {
    id: 'B5',
    old: `判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn；`,
    now: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn；`,
  },
  {
    id: 'B7a',
    old: ` - thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
    now: ` - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
  },
  {
    id: 'B7b',
    old: ` - thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
    now: ` - thugSpawn 状态=spawn 且锁定状态字段=仅背景板（所有目标均未真正锁定）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
  },
  {
    id: 'B10',
    old: ` - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
    now: ` - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
  },
];

// Collect all in-scope string fields, holding object references for in-place writes.
const fields = [];
for (const t of j[0].plotTasks) {
  if (typeof t.description === 'string') fields.push({ label: `plotTasks.${t.name}.description`, text: () => t.description, set: (v) => { t.description = v; } });
  if (Array.isArray(t.promptGroup)) {
    t.promptGroup.forEach((pg, k) => {
      if (pg && typeof pg.content === 'string') {
        const i = k;
        fields.push({ label: `plotTasks.${t.name}.promptGroup[${i}].content`, text: () => pg.content, set: (v) => { pg.content = v; } });
      }
    });
  }
}
if (typeof j[0].finalSystemDirective === 'string') {
  fields.push({ label: 'j[0].finalSystemDirective', text: () => j[0].finalSystemDirective, set: (v) => { j[0].finalSystemDirective = v; } });
}

let totalReplaced = 0;
for (const p of pairs) {
  let hits = 0;
  for (const f of fields) {
    const cur = f.text();
    if (cur.includes(p.old)) {
      const n = cur.split(p.old).length - 1;
      hits += n;
      f.set(cur.split(p.old).join(p.now));
    }
  }
  totalReplaced += hits;
  console.log(`${p.id}: hits=${hits} ${hits ? 'OK' : 'FAIL/0-hit'}`);
}

// Post-verify on the in-memory object: all NEWs present, all OLDs gone.
console.log('\n=== in-memory verification ===');
const allTexts = fields.map(f => f.text());
pairs.forEach(p => {
  const oldLeft = allTexts.reduce((a, t) => a + (t.split(p.old).length - 1), 0);
  const newCnt = allTexts.reduce((a, t) => a + (t.split(p.now).length - 1), 0);
  console.log(`${p.id}: residual_OLD=${oldLeft} NEW_present=${newCnt}`);
});

if (totalReplaced === 0) { console.error('FATAL: nothing replaced'); process.exit(1); }

const out = JSON.stringify(j, null, 2);
// re-parse gate before writing
try { JSON.parse(out); } catch (e) { console.error('FATAL: output invalid JSON', e.message); process.exit(1); }
if (!out.trimStart().startsWith('[')) { console.error('FATAL: output not top-level array'); process.exit(1); }

fs.writeFileSync(path, out, 'utf8');
console.log(`\nWROTE ${path} (${out.length} bytes, ${totalReplaced} total replacements)`);

// Independent re-read verification
const raw2 = fs.readFileSync(path, 'utf8');
let j2;
try { j2 = JSON.parse(raw2); } catch (e) { console.error('VERIFY FAIL: parse', e.message); process.exit(1); }
console.log('VERIFY: JSON.parse OK, top-level array =', Array.isArray(j2), ', starts with [ =', raw2.trimStart().startsWith('['));
const tAll = [];
for (const t of j2[0].plotTasks) {
  if (typeof t.description === 'string') tAll.push(t.description);
  (t.promptGroup || []).forEach(pg => pg && typeof pg.content === 'string' && tAll.push(pg.content));
}
if (typeof j2[0].finalSystemDirective === 'string') tAll.push(j2[0].finalSystemDirective);
const joined = tAll.join('\n');
pairs.forEach(p => {
  const oldLeft = joined.split(p.old).length - 1;
  const newCnt = joined.split(p.now).length - 1;
  console.log(`VERIFY ${p.id}: residual_OLD=${oldLeft} NEW_present=${newCnt}`);
});
console.log('DONE');
