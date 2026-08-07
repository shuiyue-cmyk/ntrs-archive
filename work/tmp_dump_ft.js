// Dump exact anchor regions for Cirno_BATTLE_Turn_FT.json (R9-final state)
const fs = require('fs');
const path = 'C:\\Users\\zouyu\\Downloads\\酒馆\\数据库\\剧情推进预设\\Cirno_BATTLE_Turn_FT.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('FIRST_CHAR:', JSON.stringify(raw.slice(0, 1)));
const j = JSON.parse(raw);
console.log('TOP_IS_ARRAY:', Array.isArray(j), 'LEN:', j.length);
const p = j[0];
console.log('TASKS:', p.plotTasks.map(t => t.id).join(','));
const tasks = {};
for (const t of p.plotTasks) tasks[t.id] = t;

function findInContent(obj, anchor, label) {
  for (let i = 0; i < obj.promptGroup.length; i++) {
    const c = obj.promptGroup[i].content;
    if (typeof c === 'string' && c.includes(anchor)) {
      const idx = c.indexOf(anchor);
      console.log(`\n===== [${label}] FOUND in ${obj.id} promptGroup[${i}] (role=${obj.promptGroup[i].role}) @char ${idx} =====`);
      console.log('--- BEFORE (60 chars) ---');
      console.log(JSON.stringify(c.slice(Math.max(0, idx - 60), idx)));
      console.log('--- ANCHOR ---');
      console.log(JSON.stringify(c.slice(idx, idx + anchor.length)));
      console.log('--- AFTER (400 chars) ---');
      console.log(JSON.stringify(c.slice(idx + anchor.length, idx + anchor.length + 400)));
      return;
    }
  }
  console.log(`\n===== [${label}] NOT FOUND in ${obj.id} promptGroup =====`);
}

function findInDesc(obj, anchor, label) {
  const c = obj.description;
  if (typeof c === 'string' && c.includes(anchor)) {
    const idx = c.indexOf(anchor);
    console.log(`\n===== [${label}] FOUND in ${obj.id} description @char ${idx} =====`);
    console.log('--- BEFORE (60 chars) ---');
    console.log(JSON.stringify(c.slice(Math.max(0, idx - 60), idx)));
    console.log('--- ANCHOR ---');
    console.log(JSON.stringify(c.slice(idx, idx + anchor.length)));
    console.log('--- AFTER (400 chars) ---');
    console.log(JSON.stringify(c.slice(idx + anchor.length, idx + anchor.length + 400)));
    return;
  }
  console.log(`\n===== [${label}] NOT FOUND in ${obj.id} description =====`);
}

// A1 anchor
const a1 = '- **对象情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，黄毛需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。';
findInContent(tasks.plotTaskThugTempo, a1, 'A1 S2-MSG0');

// A2 anchor (full sentence per spec straight version)
const a2 = '黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）（对象与黄毛变好朋友、黄毛线闭合，{{user}}与对象纯爱恋爱）';
findInDesc(tasks.plotTaskThugTempo, a2, 'A2 S2-desc');

// A3 anchor
const a3 = '- 雄竞期黄毛可以真正赢得对象的心——黄毛胜即该对象线终局锁定。';
findInContent(tasks.defaultPlotTask, a3, 'A3 S3-MSG2');

// A4 anchor
const a4 = '雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值）';
findInDesc(tasks.defaultPlotTask, a4, 'A4 S3-desc');

// A5 anchor
const a5 = '5. **竞争张力核验**：本轮是否体现 {{user}} 与黄毛之间的竞争张力？{{user}} 的追求/竞争反应是否真实有效？';
findInContent(tasks.defaultPlotTask, a5, 'A5 S3 注意力自检');

// Extra: dump full 注意力自检 question list (old 6-8 numbering) and the region after A1 anchor (spec says followed by 判断只看当下剧情 line)
const z = tasks.defaultPlotTask.promptGroup;
for (let i = 0; i < z.length; i++) {
  const c = z[i].content;
  if (typeof c === 'string' && c.includes('十一、注意力自检')) {
    const idx = c.indexOf('十一、注意力自检');
    console.log(`\n===== FULL 注意力自检 section (msg index ${i}) =====`);
    console.log(JSON.stringify(c.slice(idx, idx + 2200)));
  }
}

// Region after A1 anchor in plotTaskThugTempo promptGroup[0]
const c0 = tasks.plotTaskThugTempo.promptGroup[0].content;
const i1 = c0.indexOf(a1);
console.log('\n===== A1 anchor + FOLLOWING 500 chars =====');
console.log(JSON.stringify(c0.slice(i1, i1 + a1.length + 500)));
// Check occurrences of 判断只看当下剧情 in that content
let occ = 0, from = 0;
while ((from = c0.indexOf('判断只看当下剧情', from)) !== -1) { occ++; console.log('判断只看当下剧情 @char', from); from += 8; }
console.log('occurrences of 判断只看当下剧情 in S2-MSG0:', occ);
