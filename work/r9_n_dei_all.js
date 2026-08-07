const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
if (!raw.trim().startsWith('[')) { console.error('FAIL: raw does not start with ['); process.exit(1); }
const j = JSON.parse(raw);
if (!Array.isArray(j)) { console.error('FAIL: not top-level array'); process.exit(1); }
const p = j[0];

// [label, old, new]
const pairs = [
  ['B1', '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
        '- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且该黄毛所有目标均未锁定（背景板）——ALLin 版全场唯一黄毛——此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）'],
  ['B2', '属 📹 事后知情或 🌙 完全不知的暗线戏',
        '属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）'],
  ['B3a', '- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增',
         '- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）'],
  ['B3b', '（会经 FSD 给花火·正文）',
         '（会经 FSD 给花火·正文；刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）'],
  ['B4', '· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）',
        '· 上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验'],
  ['B5', '判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn',
        '判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn'],
  ['B7a', ' - thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。',
          ' - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。'],
  ['B7b', ' - thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）',
          ' - thugSpawn 状态=spawn 且锁定状态字段=仅背景板（所有目标均未真正锁定）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）'],
  ['B10', '见锁定状态字段）',
          '见锁定状态字段；thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）'],
];

// collect field refs (in-place via obj[key])
const fields = [];
if (Array.isArray(p.plotTasks)) {
  for (const t of p.plotTasks) {
    if (typeof t.description === 'string') fields.push({ loc: `task[${t.id}].description`, ref: t, key: 'description' });
    if (Array.isArray(t.promptGroup)) {
      t.promptGroup.forEach((m, i) => {
        if (typeof m.content === 'string') fields.push({ loc: `task[${t.id}].promptGroup[${i}]`, ref: m, key: 'content' });
      });
    }
  }
}
if (typeof p.finalSystemDirective === 'string') fields.push({ loc: 'j[0].finalSystemDirective', ref: p, key: 'finalSystemDirective' });

let total = 0;
for (const [label, old, nw] of pairs) {
  let hits = 0;
  for (const f of fields) {
    const c = f.ref[f.key].split(old).length - 1;
    if (c > 0) { hits += c; f.ref[f.key] = f.ref[f.key].split(old).join(nw); }
  }
  total += hits;
  console.log(`${label}: hits=${hits} ${hits > 0 ? 'OK' : 'MISS'}`);
}

console.log('total replacements applied:', total);
if (total === 0) { console.error('FAIL: nothing to apply'); process.exit(1); }

const out = JSON.stringify(j, null, 2);
JSON.parse(out); // must not throw
console.log('written, len:', out.length);
fs.writeFileSync(path, out, 'utf8');
console.log('DONE');
