// Probe anchors for fix_spec_r11 on Cirno_BATTLE_Turn_FT.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = j[0];

const blobs = [];
o.plotTasks.forEach((t, ti) => {
  t.promptGroup.forEach((m, mi) => {
    blobs.push({ label: `plotTask[${ti}]:${t.id} pg[${mi}] ${m.role}`, content: String(m.content) });
  });
});
blobs.push({ label: 'finalSystemDirective', content: String(o.finalSystemDirective) });
if (Array.isArray(o.prompts)) o.prompts.forEach((m, mi) => blobs.push({ label: `prompts[${mi}] ${m.role}`, content: String(m.content) }));
blobs.push({ label: 'mainPrompt', content: String(o.mainPrompt) });
blobs.push({ label: 'systemPrompt', content: String(o.systemPrompt) });

const anchors = [
  ['1', '接下来的场景中该黄毛是否有出现的可能'],
  ['2', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定'],
  ['3', '对象嫁黄毛'],
  ['4', '八题自检'],
  ['5', '仅作一行主线指示'],
  ['6', '竞争者·[五型]'],
  ['7', '不再有行动判定'],
  ['8', '或任何进度标签'],
  ['9', '明面竞争'],
  ['10', '只放刷新状态'],
  ['11', 'no-act，快速通道输出'],
  ['12a', '正常男性后续轮回归'],
  ['12b', '自然可淡出'],
];

for (const [tag, anchor] of anchors) {
  let total = 0;
  console.log(`\n===== ANCHOR [${tag}] : ${JSON.stringify(anchor)}`);
  blobs.forEach((b) => {
    let idx = b.content.indexOf(anchor);
    while (idx !== -1) {
      total++;
      const from = Math.max(0, idx - 90);
      const to = Math.min(b.content.length, idx + anchor.length + 240);
      console.log(`--- [${tag}] ${b.label} idx=${idx}`);
      console.log(JSON.stringify(b.content.slice(from, to)));
      idx = b.content.indexOf(anchor, idx + anchor.length);
    }
  });
  if (total === 0) console.log(`*** [${tag}] NOT FOUND anywhere`);
  else console.log(`[${tag}] total occurrences: ${total}`);
}
