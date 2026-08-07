// Deep inspection: dump task description fields + bytes around target occurrences
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const tasks = p.plotTasks;

console.log('=== TASK DESCRIPTION FIELDS ===');
tasks.forEach((t, ti) => {
  console.log('TASK[' + ti + '] ' + t.id + ' description:');
  console.log('  >>>' + (t.description || '(no description field)'));
  console.log('');
});

const blob = JSON.stringify(j);

function dumpAround(label, needle, before, after) {
  console.log('\n=== ' + label + ' : "' + needle + '" ===');
  let i = blob.indexOf(needle);
  let n = 0;
  while (i !== -1 && n < 5) {
    const s = Math.max(0, i - before);
    const e = Math.min(blob.length, i + needle.length + after);
    console.log('  idx=' + i + ' :: >>>' + blob.slice(s, e).replace(/\n/g, '\\n') + '<<<');
    i = blob.indexOf(needle, i + 1);
    n++;
  }
}

dumpAround('NTR/绿帽', 'NTR/绿帽', 120, 120);
dumpAround('底色仍存', '底色仍存', 250, 250);
dumpAround('关系标记', '关系标记', 120, 120);
dumpAround('竞争/信息差旁观', '竞争/信息差旁观', 120, 120);

// Confirm which promptGroup message each occurrence lives in
console.log('\n=== LOCATE occurrences in promptGroup ===');
function locate(needle) {
  for (let ti = 0; ti < tasks.length; ti++) {
    const pg = tasks[ti].promptGroup || [];
    for (let mi = 0; mi < pg.length; mi++) {
      const c = typeof pg[mi].content === 'string' ? pg[mi].content : JSON.stringify(pg[mi].content);
      const idx = c.indexOf(needle);
      if (idx !== -1) {
        console.log('  "' + needle + '" found in TASK[' + ti + '](' + tasks[ti].id + ') promptGroup[' + mi + '] at char ' + idx);
      }
    }
  }
}
locate('NTR标记');
locate('NTR/绿帽');
locate('底色仍存');
locate('关系标记');
locate('竞争/信息差旁观');

// Also locate in description fields
console.log('\n=== LOCATE in description fields ===');
function locateDesc(needle) {
  for (let ti = 0; ti < tasks.length; ti++) {
    const d = tasks[ti].description || '';
    if (d.indexOf(needle) !== -1) {
      console.log('  "' + needle + '" found in TASK[' + ti + '](' + tasks[ti].id + ') description');
    }
  }
}
locateDesc('NTR标记');
locateDesc('NTR/绿帽');
locateDesc('底色仍存');
locateDesc('竞争/信息差旁观');
