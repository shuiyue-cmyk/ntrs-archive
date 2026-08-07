// R9 fix for Cirno_NTRS_turn_edit_DEI_4.7.json (plain DEI, original NTRS 12-series)
// PART B items: B1, B2, B3, B4, B5, B8, B10. Skip ALLin/revise items.
const fs = require('fs');

const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_4.7.json';
const DRY_RUN = process.argv.includes('--probe') || process.argv.includes('--dry');

const raw = fs.readFileSync(PATH, 'utf8');
let j = JSON.parse(raw); // original top-level array
if (!Array.isArray(j)) throw new Error('top-level is NOT an array');

const pairs = [
  // [B#, old, new]
  ['B1', `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
        `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`],
  ['B2', `属 📹 事后知情或 🌙 完全不知的暗线戏`,
        `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3', `- 锁定指令：锁定 / 维持背景板`,
        `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  // B4: file wording differs from spec; semantic-nearest per spec B4 ("按各版实际文本取"/就近替换)
  ['B4', `· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
        `· 上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`],
  ['B5', `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
        `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）`],
  ['B8', `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
        `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
];

// walk all text-bearing fields in place (promptGroup[].content, task.description, finalSystemDirective)
function walkText(holder, apply) {
  if (holder == null) return;
  if (typeof holder === 'string') { apply(holder); return; }
  if (Array.isArray(holder)) { for (const x of holder) walkText(x, apply); return; }
  if (typeof holder === 'object') { for (const k of Object.keys(holder)) walkText(holder[k], apply); return; }
}
// setter-based walk so replacements happen IN PLACE via obj[key] references
function walkObj(root, fn) {
  if (Array.isArray(root)) { for (const x of root) walkObj(x, fn); return; }
  if (root && typeof root === 'object') {
    for (const k of Object.keys(root)) {
      const v = root[k];
      if (typeof v === 'string') { fn(root, k, v); }
      else walkObj(v, fn);
    }
  }
}

let applied = [];
let failed = [];
for (const [tag, old, next] of pairs) {
  let hits = 0;
  walkObj(j, (obj, key, val) => {
    const n = val.split(old).length - 1;
    if (n > 0) {
      hits += n;
      obj[key] = val.split(old).join(next);
    }
  });
  applied.push({ tag, hits });
  if (hits === 0) failed.push({ tag, old });
}

// B10: append note near T2 prologue 登场门 锁定状态 judgment (find spot, do a surgical in-place add)
let b10 = null;
{
  const note = `（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`;
  let inserted = false;
  const anchor = '锁定状态=真正锁定';
  const tail = '（标注"第三者·[五型]"）。';
  walkObj(j, (obj, key, val) => {
    if (inserted) return;
    // spot: T2 prologue 登场门 「锁定状态=真正锁定」 judgment line, append note after its full sentence
    const i = val.indexOf(anchor);
    if (i >= 0) {
      const jj = val.indexOf(tail, i);
      if (jj >= 0) {
        obj[key] = val.slice(0, jj + tail.length) + note + val.slice(jj + tail.length);
        inserted = true;
      }
    }
  });
  b10 = inserted;
}

// report
console.log('--- hit counts ---');
for (const a of applied) console.log(`${a.tag}: ${a.hits} hit(s)`);
console.log(`B10 note inserted: ${b10}`);
if (failed.length) {
  console.log('--- 0-HIT items ---');
  for (const f of failed) {
    const idx = raw.indexOf(f.old);
    console.log(`\n[${f.tag}] count=0 (searched ${f.old.length} chars)`);
    if (idx >= 0) console.log('  (spec OLD found in raw but no walk hit — should not happen)');
    else {
      // context dump: find first 4 chars of old
      const probe = f.old.slice(0, 12);
      let p = raw.indexOf(probe);
      let shown = 0;
      while (p >= 0 && shown < 3) {
        console.log(`  ctx@${p}: ${JSON.stringify(raw.slice(Math.max(0,p-40), p+80))}`);
        p = raw.indexOf(probe, p + 1);
        shown++;
      }
      if (shown === 0) console.log(`  probe "${probe}" not found at all`);
    }
  }
}

if (DRY_RUN) {
  console.log('\nDRY RUN — no write.');
  process.exit(0);
}

if (failed.length > 0) {
  console.log('\nABORT: 0-hit pair(s) present, not writing.');
  process.exit(1);
}

// write back: original j (array), 2-space indent, utf8
const out = JSON.stringify(j, null, 2);
if (!out.startsWith('[')) throw new Error('serialized output does not start with [');
fs.writeFileSync(PATH, out, 'utf8');
console.log('\nWROTE OK:', PATH, out.length, 'bytes');
