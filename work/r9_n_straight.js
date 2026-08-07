const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
if (!Array.isArray(j) || !raw.trimStart().startsWith('[')) throw new Error('top level is not array');

const root = j[0];
const fields = [];
for (const t of root.plotTasks || []) {
  const label = t.name || t.id || '?';
  if (typeof t.description === 'string') fields.push({ obj: t, key: 'description', where: 'task.description(' + label + ')' });
  if (Array.isArray(t.promptGroup)) {
    t.promptGroup.forEach((m, i) => {
      if (typeof m.content === 'string') fields.push({ obj: m, key: 'content', where: 'promptGroup[' + i + '](' + label + ')' });
    });
  }
}
if (typeof root.finalSystemDirective === 'string') fields.push({ obj: root, key: 'finalSystemDirective', where: 'finalSystemDirective' });

const pairs = [
  {
    label: 'B1', old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    neu: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`
  },
  {
    label: 'B2', old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    neu: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`
  },
  {
    label: 'B3', old: `- 锁定指令：锁定 / 维持背景板`,
    neu: `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`
  },
  {
    label: 'B3b', old: `（会经 FSD 给花火·正文）`,
    neu: `（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`
  },
  {
    label: 'B4', old: `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    neu: `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`
  },
  {
    label: 'B5', old: `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
    neu: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）`
  },
  {
    label: 'B8', old: `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
    neu: `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`
  },
  {
    label: 'B10', old: `thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
    neu: `thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`
  }
];

let totalHits = 0;
const report = [];
for (const p of pairs) {
  let hits = 0;
  const perField = [];
  for (const f of fields) {
    const str = f.obj[f.key];
    const n = str.split(p.old).length - 1;
    if (n > 0) {
      hits += n;
      perField.push(f.where + ':' + n);
      f.obj[f.key] = str.split(p.old).join(p.neu);
    }
  }
  totalHits += hits;
  report.push(p.label + ': hits=' + hits + (perField.length ? '  @ ' + perField.join(', ') : ''));
}

console.log(report.join('\n'));
console.log('TOTAL HITS: ' + totalHits);

const out = JSON.stringify(j, null, 2);
const recheck = JSON.parse(out); // throws if invalid
if (!Array.isArray(recheck)) throw new Error('output top level is not array');
fs.writeFileSync(path, out, 'utf8');
console.log('WROTE OK, bytes=' + Buffer.byteLength(out, 'utf8'));
