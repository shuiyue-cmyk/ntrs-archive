const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json';
const DRYRUN = process.argv[2] === 'dry';

const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
if (!Array.isArray(j)) throw new Error('top-level is not array');
const p = j[0];

// pairs: B1..B10 (B6/B8/B11 skipped per spec)
const pairs = [
  {
    id: 'B1', note: '快速通道 prologue 附背景板浅度出场',
    old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    neu: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  },
  {
    id: 'B2', note: '场景外暗线戏 41% 门槛',
    old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    neu: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  },
  {
    id: 'B3a', note: '锁定指令行加调度注记',
    old: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增`,
    neu: `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  },
  {
    id: 'B3b', note: 'thugSpawn 标签调度字段注记',
    old: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）`,
    neu: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  },
  {
    id: 'B4', note: '上轮%权威源→黄毛表 progress_percent',
    old: `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    neu: `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  },
  {
    id: 'B5', note: '可行动→在场/出场合理',
    old: `判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
    neu: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  },
  {
    id: 'B7a', note: '锁定目标列表非空→锁定状态字段=真正锁定',
    old: `     - thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
    neu: `     - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
  },
  {
    id: 'B7b', note: '锁定目标列表为空→锁定状态字段=仅背景板',
    old: `     - thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
    neu: `     - thugSpawn 状态=spawn 且锁定状态字段=仅背景板（所有目标均未真正锁定）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
  },
  {
    id: 'B9a', note: 'After <thugAction> → <thugActionReason>',
    old: `After <thugAction>, output ONE tag: <userCalib>`,
    neu: `After <thugActionReason>, output ONE tag: <userCalib>`,
  },
  {
    id: 'B9b', note: 'OUTPUT FORMAT 紧接 <thugActionReason>',
    old: `OUTPUT FORMAT (单标签，紧接在 <thugAction> 之后)`,
    neu: `OUTPUT FORMAT (单标签，紧接在 <thugActionReason> 之后)`,
  },
  {
    id: 'B10', note: 'T2 登场门补锁定指令同义注记',
    old: `**prologue 黄毛登场角色门（必须）**（依据 \`<thugSpawn>\` + \`<thugAction>\`，违反 = 输出失败）：`,
    neu: `**prologue 黄毛登场角色门（必须）**（依据 \`<thugSpawn>\` + \`<thugAction>\`，违反 = 输出失败；thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）：`,
  },
];

// collect all target string fields (in place via obj[key])
const fields = [];
if (p.finalSystemDirective) fields.push({ obj: p, key: 'finalSystemDirective', label: 'FSD' });
for (const t of p.plotTasks) {
  if (t.description) fields.push({ obj: t, key: 'description', label: `${t.id}.description` });
  if (t.promptGroup) t.promptGroup.forEach((m, i) => {
    if (typeof m.content === 'string') fields.push({ obj: m, key: 'content', label: `${t.id}.promptGroup[${i}]` });
  });
}

let changed = 0;
for (const pair of pairs) {
  let hits = 0;
  for (const f of fields) {
    const cnt = f.obj[f.key].split(pair.old).length - 1;
    if (cnt > 0) {
      hits += cnt;
      f.obj[f.key] = f.obj[f.key].split(pair.old).join(pair.neu);
    }
  }
  console.log(`${pair.id} [${pair.note}]: hits=${hits} ${hits > 0 ? 'OK' : 'FAIL-0HIT'}`);
  if (hits > 0) changed++;
}

const out = JSON.stringify(j, null, 2);
const ok = (() => { try { JSON.parse(out); return true; } catch (e) { return false; } })();

if (DRYRUN) {
  console.log(`\n[DRYRUN] would write: parseOK=${ok}, changedPairs=${changed}/${pairs.length}`);
  process.exit(0);
}

if (ok && out.trimStart().startsWith('[')) {
  fs.writeFileSync(path, out, 'utf8');
  console.log(`\nWRITTEN. pairs changed: ${changed}/${pairs.length}`);
} else {
  console.log(`\nABORT write: parseOK=${ok} topArray=${out.trimStart().startsWith('[')}`);
  process.exit(1);
}
