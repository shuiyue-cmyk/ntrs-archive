// R9 Part B fix: Cirno_NTRS_turn_edit_FT_ALLin_4.7.json
// Applies B1(ALLin), B2, B3(ALLin + S2 判定段注), B4, B5(ALLin), B7(ALLin), B10
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw); // keep ORIGINAL top-level array
const p = j[0];

const pairs = [
  // B1 (ALLin 快速通道 prologue 行)
  {
    id: 'B1',
    old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    neu: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  },
  // B2 (场景外 act 知情度 41% 门槛)
  {
    id: 'B2',
    old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    neu: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  },
  // B3 (thugSpawn 锁定指令行 - ALLin 版)
  {
    id: 'B3',
    old: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增`,
    neu: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  },
  // B3 第二句: S2 判定段 <thugSpawn> 标签句尾追加调度注
  {
    id: 'B3b',
    old: `只给导演读，不进 FSD）；禁止标签外「理由：」行**`,
    neu: `只给导演读，不进 FSD）；禁止标签外「理由：」行**（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  },
  // B4 (sparkNotes 上轮%权威源 - 本版措辞变体语义替换)
  {
    id: 'B4',
    old: `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    neu: `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  },
  // B5 (ALLin 版 S2 引言 — 实际文本父句含扩展内容，按前缀语义替换)
  {
    id: 'B5',
    old: `判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
    neu: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  },
  // B7a (T2 登场门 - 锁定目标列表非空 → 锁定状态字段=真正锁定)
  {
    id: 'B7a',
    old: ` - thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
    neu: ` - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
  },
  // B7b (T2 登场门 - 锁定目标列表为空 → 锁定状态字段=仅背景板)
  {
    id: 'B7b',
    old: ` - thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
    neu: ` - thugSpawn 状态=spawn 且锁定状态字段=仅背景板（所有目标均未真正锁定）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
  },
  // B10 (T2 登场门判据处补注 锁定状态 vs 锁定指令 同义说明)
  {
    id: 'B10',
    old: `，只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触任何目标。`,
    neu: `，只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触任何目标。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
  },
];

// Walk promptGroup contents + task descriptions + FSD, applying pairs in place
const results = pairs.map(pair => ({ id: pair.id, hits: 0, ok: false }));

function applyTo(str) {
  for (let k = 0; k < pairs.length; k++) {
    const pair = pairs[k];
    const c = str.split(pair.old).length - 1;
    if (c > 0) {
      results[k].hits += c;
      str = str.split(pair.old).join(pair.neu);
    }
  }
  return str;
}

// j[0].finalSystemDirective (if present)
if (typeof p.finalSystemDirective === 'string') {
  p.finalSystemDirective = applyTo(p.finalSystemDirective);
}
// plotTasks: promptGroup content + description
for (const task of p.plotTasks) {
  if (task.promptGroup) {
    for (const msg of task.promptGroup) {
      if (typeof msg.content === 'string') msg.content = applyTo(msg.content);
    }
  }
  if (typeof task.description === 'string') task.description = applyTo(task.description);
}

// Report per-pair
for (const r of results) {
  r.ok = r.hits > 0;
  console.log(`${r.id}: hits=${r.hits} ${r.ok ? 'OK' : 'FAIL'}`);
}
const zeroHits = results.filter(r => r.hits === 0).map(r => r.id);
console.log('zero-hit pairs:', zeroHits.length ? zeroHits.join(',') : '(none)');

// Write back only if valid + top-level array
const out = JSON.stringify(j, null, 2);
if (!raw.trim().startsWith('[')) { console.log('ABORT: raw does not start with ['); process.exit(1); }
try { JSON.parse(out); } catch (e) { console.log('ABORT: JSON invalid after stringify', e.message); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
console.log('written OK, bytes:', Buffer.byteLength(out, 'utf8'));
