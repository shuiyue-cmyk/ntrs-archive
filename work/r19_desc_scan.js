// 扫描 desc 补充锚点分布
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const anchors = {
  N12_S2_HEAD: '判定本轮黄毛刷新与行动并写理由。',
  N12_S3_HEAD: '落实知情度三档（在场见证/事后知情/完全不知）与 NTRS 进度',
  N12_S3_HEAD2: '落实知情度三档（在场见证/事后知情/完全不知）',
  HYB_S2_NOTBL: '不依赖任何表格：从剧情中梳理',
  HYB_S3_ZHONG: '黄毛胜·终局落实线锁定场景',
  HYB_S3_ZKU: '黄毛不多介入 {{user}} 生活）',
};
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  const d2 = (s2 && s2.description) || '';
  const d3 = (s3 && s3.description) || '';
  const blob = d2 + '|' + d3;
  const hits = Object.entries(anchors).map(([k, v]) => k + ':' + (blob.split(v).length - 1)).filter(h => !h.endsWith(':0'));
  console.log(fn + (hits.length ? ' | ' + hits.join(' ') : ' | (none)'));
}
