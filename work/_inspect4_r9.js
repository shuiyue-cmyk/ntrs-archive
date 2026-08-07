const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];
for (const t of p.plotTasks || []) {
  (t.promptGroup || []).forEach((m, i) => {
    const idx = m.content.indexOf('prologue 黄毛登场角色门');
    if (idx !== -1) {
      console.log(`[${t.id}].promptGroup[${i}] @${idx}`);
      console.log(JSON.stringify(m.content.slice(idx - 30, idx + 180)));
      // show each char code in the header region
      const seg = m.content.slice(idx, idx + 70);
      console.log('charCodes:', Array.from(seg).map(c => c.codePointAt(0).toString(16)).join(' '));
    }
  });
}
