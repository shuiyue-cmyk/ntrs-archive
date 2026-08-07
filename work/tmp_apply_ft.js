// Apply PART A (A1-A5) of fix_spec_r10.md to Cirno_BATTLE_Turn_FT.json (纯雄竞 FT / 男娘系 / 后宫线 / no NTRS)
const fs = require('fs');
const FILE = 'C:\\Users\\zouyu\\Downloads\\酒馆\\数据库\\剧情推进预设\\Cirno_BATTLE_Turn_FT.json';
const raw = fs.readFileSync(FILE, 'utf8');

// ---------- pre-write assertions ----------
if (!raw.trim().startsWith('[')) { console.log('ABORT: raw does not start with ['); process.exit(1); }
const j = JSON.parse(raw);                 // keep original parsed reference (top-level array)
if (!Array.isArray(j) || j.length !== 1) { console.log('ABORT: top-level is not single-element array'); process.exit(1); }
const p = j[0];
const tasks = {};
for (const t of p.plotTasks) tasks[t.id] = t;
const thug = tasks.plotTaskThugTempo;
const dir  = tasks.defaultPlotTask;
if (!thug || !dir) { console.log('ABORT: tasks not found'); process.exit(1); }

const report = {};
function countIn(s, sub) { let n = 0, i = 0; while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }

// ================= A1: S2-MSG0 insert new bullet after 对象情感倾向 bullet =================
{
  const anchor = '- **对象情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，黄毛需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。';
  const NEW = '- **已站队对象胜负判定（亲密开局专用）**：对象出场即与 {{user}} 已是恋人/配偶/已明确站队 {{user}} 时——① **黄毛败判据暂缓**：雄竞期内对象对 {{user}} 的既有态度/行为/话语倾向（既定关系的常态）**不计入黄毛败判据**——黄毛败仅在黄毛已取得实质进展（对象出现动摇事件：态度松动/暧昧回应/私下往来）之后、对象仍明确选择 {{user}}（拒绝黄毛邀约/疏远/表态）时才可判；② **黄毛胜须积累**：已站队对象不因单轮行动判黄毛胜——黄毛胜须经多轮实质进展积累（对象动摇事件逐轮累积）后，对象明确离弃 {{user}}、选择黄毛的剧情事件（表态/确立关系/成婚）确认；③ 未达成以上判据前，该对象线维持雄竞期、黄毛持续行动判定照常。';
  const c = thug.promptGroup[0].content;
  const n = countIn(c, anchor);
  if (n === 1 && !c.includes(NEW)) {
    thug.promptGroup[0].content = c.replace(anchor, anchor + '\n' + NEW);   // in-place on parsed object
    report.A1 = 'OK (inserted after anchor, S2-MSG0 promptGroup[0])';
  } else {
    report.A1 = `FAIL (anchor count=${n}, already present=${c.includes(NEW)})`;
  }
}

// ================= A2: S2 description append 已站队对象 desc after full 黄毛败 sentence =================
{
  const anchor = '黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）（对象与黄毛变好朋友、黄毛线闭合，{{user}}与对象纯爱恋爱）';
  const NEW = ' 已站队对象（出场即恋人/配偶/已明确站队）雄竞期内既有倾向不计黄毛败，黄毛败须黄毛实质进展后对象仍明确选择{{user}}才可判；黄毛胜须多轮进展积累+对象明确离弃选择黄毛的剧情事件确认';
  const d = thug.description;
  const n = countIn(d, anchor);
  if (n === 1 && !d.includes(NEW.trim())) {
    thug.description = d.replace(anchor, anchor + NEW);
    report.A2 = 'OK (appended after full 黄毛败 sentence, before 男娘系 sentence, S2 desc)';
  } else {
    report.A2 = `FAIL (anchor count=${n}, already present=${d.includes(NEW.trim())})`;
  }
}

// ================= A3: S3-MSG2 雄竞期编排 sub-section =================
{
  const anchor = '- 雄竞期黄毛可以真正赢得对象的心——黄毛胜即该对象线终局锁定。';
  const NEW = '- **已站队对象（亲密开局）编排**：对象与 {{user}} 已是恋人/配偶/已明确站队时——{{user}} 是守成方而非追求方：竞争反应为守护/不安/查岗/紧张吃醋/暗自提防（不写「追求加码」语言）；对象在既定关系内的动摇须合理化（相处倦怠/新鲜感缺失/诱惑冲击/信任裂缝等关系内危机驱动，非突兀劈腿），动摇幅度随黄毛行动积累逐轮加深；黄毛竞争难度高，须多轮实质行动积累才可能撬动对象——黄毛胜的终局戏为对象明确离弃 {{user}} 改选黄毛（表态/确立关系/成婚），与该积累过程衔接，禁止单轮撬动判胜。';
  const c = dir.promptGroup[2].content;
  const n = countIn(c, anchor);
  if (n === 1 && !c.includes(NEW)) {
    dir.promptGroup[2].content = c.replace(anchor, anchor + '\n' + NEW);
    report.A3 = 'OK (sub-section inserted between anchor line and 黄毛败·友好+天意后宫线 section, S3-MSG2 promptGroup[2])';
  } else {
    report.A3 = `FAIL (anchor count=${n}, already present=${c.includes(NEW)})`;
  }
}

// ================= A4: S3 description sentence replacement =================
{
  const OLD = '雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值）';
  const NEW = '雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值；对象已站队/亲密开局时 {{user}} 为守成方——守护/不安/查岗/吃醋提防，对象动摇合理化，黄毛须多轮积累才可能撬动）';
  const d = dir.description;
  const n = countIn(d, OLD);
  if (n === 1 && !d.includes(NEW)) {
    dir.description = d.replace(OLD, NEW);
    report.A4 = 'OK (整句替换, prefix of the 按线状态编排 series kept, S3 desc)';
  } else {
    report.A4 = `FAIL (old count=${n}, already new=${d.includes(NEW)})`;
  }
}

// ================= A5: S3 注意力自检 new question + renumber old 6-8 -> 7-9 =================
{
  const anchor = '5. **竞争张力核验**：本轮是否体现 {{user}} 与黄毛之间的竞争张力？{{user}} 的追求/竞争反应是否真实有效？';
  const NEW = '6. **亲密开局核验**：若本轮涉及已站队对象（与 {{user}} 已是恋人/配偶），是否按守成方编排（{{user}} 守护/不安/查岗而非追求加码、对象动摇合理化、黄毛未凭单轮行动被判胜）？（原 6-8 题顺延编号为 7-9）';
  let c = dir.promptGroup[17].content;
  const n = countIn(c, anchor);
  const okOld6 = countIn(c, '6. **召回自洽**');
  const okOld7 = countIn(c, '7. **线状态 + 黄毛登场核验**');
  const okOld8 = countIn(c, '8. **无进度标签核验**');
  if (n === 1 && !c.includes(NEW)) {
    c = c.replace('8. **无进度标签核验**', '9. **无进度标签核验**');
    c = c.replace('7. **线状态 + 黄毛登场核验**', '8. **线状态 + 黄毛登场核验**');
    c = c.replace('6. **召回自洽**', '7. **召回自洽**');
    c = c.replace(anchor, anchor + '\n' + NEW);
    dir.promptGroup[17].content = c;
    const after6 = countIn(c, '6. **召回自洽**');
    const after7 = countIn(c, '7. **召回自洽**');
    const after8 = countIn(c, '8. **线状态 + 黄毛登场核验**');
    const after9 = countIn(c, '9. **无进度标签核验**');
    report.A5 = `OK (new Q6 inserted; old 6-8 renumbered -> 7-9 [6gone=${after6},7=${after7},8=${after8},9=${after9}]; pre-counts old6=${okOld6},old7=${okOld7},old8=${okOld8})`;
  } else {
    report.A5 = `FAIL (anchor count=${n}, already present=${c.includes(NEW)})`;
  }
}

// ---------- verify in-memory before write ----------
console.log('REPORT:', JSON.stringify(report, null, 2));
const out = JSON.stringify(j, null, 2) + (raw.endsWith('\n') ? '\n' : '');
try {
  const chk = JSON.parse(out);
  const okArr = out.trim().startsWith('[');
  const okArr2 = Array.isArray(chk) && chk.length === 1;
  console.log('PRE-WRITE CHECK: parses=', true, 'startsWith[=', okArr, 'topLevelArray=', okArr2);
  if (!okArr || !okArr2) { console.log('ABORT: structure check failed, NOT writing'); process.exit(1); }
  // residual checks
  const blob = JSON.stringify(chk);
  const res = {
    A1_new_present: blob.includes('已站队对象胜负判定（亲密开局专用）'),
    A2_new_present: blob.includes('已站队对象（出场即恋人/配偶/已明确站队）雄竞期内既有倾向不计黄毛败'),
    A3_new_present: blob.includes('已站队对象（亲密开局）编排'),
    A4_old_gone: !blob.includes('胜负靠剧情无数值）'),
    A4_new_present: blob.includes('对象已站队/亲密开局时 {{user}} 为守成方'),
    A5_new_present: blob.includes('6. **亲密开局核验**'),
    A5_renum_ok: !blob.includes('6. **召回自洽**') && blob.includes('9. **无进度标签核验**'),
  };
  console.log('RESIDUAL CHECK:', JSON.stringify(res, null, 2));
  const allOk = Object.values(report).every(v => v.startsWith('OK')) && Object.values(res).every(Boolean);
  if (!allOk) { console.log('ABORT: verification failed, NOT writing'); process.exit(1); }
  fs.writeFileSync(FILE, out, 'utf8');
  console.log('WROTE OK, bytes=', out.length);
} catch (e) {
  console.log('ABORT: post-edit JSON parse failed:', e.message);
  process.exit(1);
}
