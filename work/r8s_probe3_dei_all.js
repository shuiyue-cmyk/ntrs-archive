// Dump full S2 region: from "判定： ① spawn" area to G1 end
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
const start = raw.indexOf('出场可能性判定');
// find where the section begins: search backwards for "spawn" header markers
const g2i = raw.indexOf('刷新成功判定标准');
const seg = raw.slice(g2i - 900, g2i + 700);
console.log('--- segment before G2 (len', seg.length, ') ---');
console.log(seg.replace(/\\n/g, '\n'));
