// Probe2: precise regions for DEI_NTRS r11 items 15, 18, 27, 30 + full-blob 线状态 scan
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = Array.isArray(j) ? j[0] : j;

// All text blobs including top-level fields
const blobs = [];
(o.plotTasks || []).forEach((t, ti) => {
  (t.promptGroup || []).forEach((m, mi) => {
    blobs.push({ label: `T${ti}.pg[${mi}] ${m.role}`, content: String(m.content) });
  });
});
blobs.push({ label: 'finalSystemDirective', content: String(o.finalSystemDirective) });
if (Array.isArray(o.prompts)) o.prompts.forEach((m, mi) => blobs.push({ label: `prompts[${mi}] ${m.role}`, content: String(m.content) }));
if (Array.isArray(o.promptGroup)) o.promptGroup.forEach((m, mi) => blobs.push({ label: `topPromptGroup[${mi}] ${m.role}`, content: String(m.content) }));
blobs.push({ label: 'mainPrompt', content: String(o.mainPrompt) });
blobs.push({ label: 'systemPrompt', content: String(o.systemPrompt) });

function find(tag, needle, padBefore, padAfter) {
  let total = 0;
  console.log(`\n===== [${tag}] ${JSON.stringify(needle)}`);
  blobs.forEach((b) => {
    let idx = b.content.indexOf(needle);
    while (idx !== -1) {
      total++;
      const from = Math.max(0, idx - (padBefore || 0));
      const to = Math.min(b.content.length, idx + needle.length + (padAfter || 0));
      console.log(`--- [${tag}] ${b.label} idx=${idx}`);
      console.log(JSON.stringify(b.content.slice(from, to)));
      idx = b.content.indexOf(needle, idx + needle.length);
    }
  });
  if (total === 0) console.log(`*** [${tag}] NOT FOUND`);
  else console.log(`[${tag}] total: ${total}`);
}

// Item 15: full 雄竞核心规则 paragraph region in T1.pg[0]
find('15-para', '雄竞核心规则', 100, 900);

// Item 18b: 线状态判定规则 bullets region T1.pg[4]
find('18b-rule', '线状态判定规则', 0, 1200);

// Item 27: all 忠诚/动摇型不出现
find('27-noappear', '忠诚/动摇型不出现', 120, 220);

// Item 27b: all "不出现" near 41%
find('27b', '41% 起步', 60, 160);

// Item 30: all 竞争者·[五型]
find('30-five', '竞争者·[五型]', 80, 220);

// Item 18c: 三种/四种线状态
find('18c', '线状态之一', 60, 60);

// Item 18: any remaining 3-state enumeration forms
find('18-alt', '线状态（', 60, 120);
find('18-alt2', '线状态=', 60, 120);

// Item 29: 不可避
find('29-xp', '不可避', 60, 80);

// Item 19: exact baseline line
find('19-base', '首轮基线', 60, 160);
