// Dump S2 section of the target file around the spawn definition
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
// S2 region: from "出场可能性判定" (~20566-180=20386) back to "两种情形" start ~19300; dump 18800..21400
const start = raw.indexOf('出场可能性判定');
const seg = raw.slice(start - 700, start + 900);
console.log('--- segment around 出场可能性判定 (len', seg.length, ') ---');
console.log(seg.replace(/\\n/g, '\n'));
