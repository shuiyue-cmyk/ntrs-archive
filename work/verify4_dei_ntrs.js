const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const t1 = j[0].plotTasks[1].promptGroup;
const t2 = j[0].plotTasks[2].promptGroup;

// G15a region (S2-MSG2 = t1[2]) and G5 (t1[4] around TRIGGER), S6g (t1[4] tracking format)
const c2 = t1[2].content;
const i2 = c2.indexOf('\u9ec4\u6bdb\u6863\u6848\u6570\u636e');
console.log('=== G15a S2-MSG2 ===');
console.log(JSON.stringify(c2.slice(Math.max(0, i2 - 30), i2 + 500)));
console.log();

const c4 = t1[4].content;
const i4 = c4.indexOf('\u4f46\u672c\u8f6e\u82e5\u521a\u786e\u8ba4\u80dc\u8d1f');
console.log('=== G5 S2-MSG4 例外句 ===');
console.log(JSON.stringify(c4.slice(i4, i4 + 200)));
console.log();

const i4b = c4.indexOf('\u578b\u4f53\u6982\u8981=');
console.log('=== S6g 追踪格式行 ===');
console.log(JSON.stringify(c4.slice(i4b, i4b + 120)));
console.log();

// G15b region (S3-MSG15 = t2[15])
const c15 = t2[15].content;
const i15 = c15.indexOf('\u9ec4\u6bdb\u6863\u6848\u6570\u636e');
console.log('=== G15b S3-MSG15 ===');
console.log(JSON.stringify(c15.slice(Math.max(0, i15 - 20), i15 + 300)));
