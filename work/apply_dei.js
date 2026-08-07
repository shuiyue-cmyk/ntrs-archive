// Apply PART A (A1-A5) to Cirno_BATTLE_Turn_DEI.json — in-place edits on parsed object
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw0 = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw0); // keep original parsed object reference (top-level array)
const p = j[0];
const tasks = {};
for (const t of p.plotTasks) tasks[t.id] = t;

const seg = [];
let allOk = true;

// ---------- A1: S2-MSG0 new bullet ----------
{
  const c = tasks['plotTaskThugTempo'].promptGroup[0].content;
  const old = '- **对象情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，黄毛需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。';
  const n = c.split(old).length - 1;
  const add = '\n- **已站队对象胜负判定（亲密开局专用）**：对象出场即与 {{user}} 已是恋人/配偶/已明确站队 {{user}} 时——① **黄毛败判据暂缓**：雄竞期内对象对 {{user}} 的既有态度/行为/话语倾向（既定关系的常态）**不计入黄毛败判据**——黄毛败仅在黄毛已取得实质进展（对象出现动摇事件：态度松动/暧昧回应/私下往来）之后、对象仍明确选择 {{user}}（拒绝黄毛邀约/疏远/表态）时才可判；② **黄毛胜须积累**：已站队对象不因单轮行动判黄毛胜——黄毛胜须经多轮实质进展积累（对象动摇事件逐轮累积）后，对象明确离弃 {{user}}、选择黄毛的剧情事件（表态/确立关系/成婚）确认；③ 未达成以上判据前，该对象线维持雄竞期、黄毛持续行动判定照常。';
  if (n === 1) { tasks['plotTaskThugTempo'].promptGroup[0].content = c.split(old).join(old + add); seg.push('A1 ok (count=1)'); }
  else { allOk = false; seg.push(`A1 FAIL count=${n}`); seg.push('A1 actual: ' + JSON.stringify(c.slice(c.indexOf('对象情感倾向'), c.indexOf('对象情感倾向') + 300))); }
}

// ---------- A2: S2 description append (DEI: partial anchor) ----------
{
  const desc = tasks['plotTaskThugTempo'].description;
  const old = '黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）';
  const n = desc.split(old).length - 1;
  const add = ' 已站队对象（出场即恋人/配偶/已明确站队）雄竞期内既有倾向不计黄毛败，黄毛败须黄毛实质进展后对象仍明确选择{{user}}才可判；黄毛胜须多轮进展积累+对象明确离弃选择黄毛的剧情事件确认';
  if (n === 1) { tasks['plotTaskThugTempo'].description = desc.split(old).join(old + add); seg.push('A2 ok (count=1)'); }
  else { allOk = false; seg.push(`A2 FAIL count=${n}`); }
}

// ---------- A3: S3-MSG2 雄竞期编排 sub-section ----------
{
  const msg = tasks['defaultPlotTask'].promptGroup[2];
  const c = msg.content;
  const old = '- 雄竞期黄毛可以真正赢得对象的心——黄毛胜即该对象线终局锁定。';
  const n = c.split(old).length - 1;
  const add = '\n- **已站队对象（亲密开局）编排**：对象与 {{user}} 已是恋人/配偶/已明确站队时——{{user}} 是守成方而非追求方：竞争反应为守护/不安/查岗/紧张吃醋/暗自提防（不写「追求加码」语言）；对象在既定关系内的动摇须合理化（相处倦怠/新鲜感缺失/诱惑冲击/信任裂缝等关系内危机驱动，非突兀劈腿），动摇幅度随黄毛行动积累逐轮加深；黄毛竞争难度高，须多轮实质行动积累才可能撬动对象——黄毛胜的终局戏为对象明确离弃 {{user}} 改选黄毛（表态/确立关系/成婚），与该积累过程衔接，禁止单轮撬动判胜。';
  if (n === 1) { tasks['defaultPlotTask'].promptGroup[2].content = c.split(old).join(old + add); seg.push('A3 ok (count=1)'); }
  else { allOk = false; seg.push(`A3 FAIL count=${n}`); seg.push('A3 actual ctx: ' + JSON.stringify(c.slice(c.indexOf('雄竞期黄毛') - 60, c.indexOf('雄竞期黄毛') + 200))); }
}

// ---------- A4: S3 description replacement ----------
{
  const desc = tasks['defaultPlotTask'].description;
  const old = '雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值）';
  const n = desc.split(old).length - 1;
  const fresh = '雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值；对象已站队/亲密开局时 {{user}} 为守成方——守护/不安/查岗/吃醋提防，对象动摇合理化，黄毛须多轮积累才可能撬动）';
  if (n === 1) { tasks['defaultPlotTask'].description = desc.split(old).join(fresh); seg.push('A4 ok (count=1)'); }
  else { allOk = false; seg.push(`A4 FAIL count=${n}`); }
}

// ---------- A5: S3 注意力自检 new item 6 + renumber 6-8 -> 7-9 ----------
{
  const msg = tasks['defaultPlotTask'].promptGroup[17];
  let c = msg.content;
  const old = '5. **竞争张力核验**：本轮是否体现 {{user}} 与黄毛之间的竞争张力？{{user}} 的追求/竞争反应是否真实有效？';
  const n = c.split(old).length - 1;
  const add = '\n6. **亲密开局核验**：若本轮涉及已站队对象（与 {{user}} 已是恋人/配偶），是否按守成方编排（{{user}} 守护/不安/查岗而非追求加码、对象动摇合理化、黄毛未凭单轮行动被判胜）？';
  const renames = [
    ['6. **召回自洽**', '7. **召回自洽**'],
    ['7. **线状态 + 黄毛登场核验**', '8. **线状态 + 黄毛登场核验**'],
    ['8. **无进度标签核验**', '9. **无进度标签核验**'],
  ];
  let fail = '';
  if (n !== 1) { fail = `A5 anchor FAIL count=${n}`; }
  for (const [o, nn] of renames) {
    if (c.split(o).length - 1 !== 1) fail += ` | renumber "${o}" count=${c.split(o).length - 1}`;
  }
  if (!fail) {
    c = c.split(old).join(old + add);
    for (const [o, nn] of renames) c = c.split(o).join(nn);
    tasks['defaultPlotTask'].promptGroup[17].content = c;
    seg.push('A5 ok (anchor count=1, renumbered 6-8 -> 7-9)');
  } else { allOk = false; seg.push('A5 FAIL: ' + fail); }
}

console.log(seg.join('\n'));

if (allOk) {
  // write back — keep top-level array; file uses 2-space indent
  const out = JSON.stringify(j, null, 2);
  if (!out.startsWith('[')) { console.log('ABORT: output does not start with ['); process.exit(1); }
  fs.writeFileSync(path, out, 'utf8');
  console.log('WRITTEN. bytes=' + out.length + ' startsWith=[' + out.startsWith('['));
} else {
  console.log('NOT WRITTEN — anchor mismatch.');
}
