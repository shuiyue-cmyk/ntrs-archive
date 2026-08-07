// Targeted item 17 fix for DEI_NTRS (actual bytes have no ** around 仍按雄竞判定未豁免)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = Array.isArray(j) ? j[0] : j;

const old = 'c) 已站队的对象（已是 {{user}} 恋人/配偶）是否仍按雄竞判定未豁免？黄毛是否照常刷新/行动？';
const neu = 'c) 已站队的对象（已是 {{user}} 恋人/配偶/血亲义亲）是否**已走亲密开局分流**（不进入雄竞期、线状态=NTRS期·亲密开局、黄毛积极行动门满足即 act）？';

let total = 0;
(o.plotTasks || []).forEach((t) => {
  (t.promptGroup || []).forEach((m) => {
    if (typeof m.content === 'string' && m.content.includes(old)) {
      const cnt = m.content.split(old).length - 1;
      m.content = m.content.split(old).join(neu);
      total += cnt;
    }
  });
});
console.log('ITEM 17 found=' + total + ' expected=1 ' + (total === 1 ? 'OK' : 'MISMATCH'));
if (total !== 1) {
  // diagnose
  (o.plotTasks || []).forEach((t) => {
    (t.promptGroup || []).forEach((m) => {
      const idx = (m.content || '').indexOf('已站队的对象');
      if (idx !== -1) console.log('diag:', JSON.stringify(m.content.slice(idx, idx + 70)));
    });
  });
}
const out = JSON.stringify(j, null, 2);
fs.writeFileSync(path, out, 'utf8');
console.log('written. raw starts with [ : ' + out.trim().startsWith('['));
