// Search for G3-like forms and check all 18 files' G3 presence
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = [
  'Cirno_BATTLE_Turn_DEI.json','Cirno_BATTLE_Turn_DEI_NTRS.json','Cirno_BATTLE_Turn_FT.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json','Cirno_BATTLE_Turn_straight.json','Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_NTRS_turn_edit_DEI_4.7.json','Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json','Cirno_NTRS_turn_edit_DEI_revise_4.7.json','Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json',
  'Cirno_NTRS_turn_edit_FT_4.7.json','Cirno_NTRS_turn_edit_FT_ALLin_4.7.json','Cirno_NTRS_turn_edit_FT_revise_4.7.json','Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json',
  'Cirno_NTRS_turn_edit_straight_4.7.json','Cirno_NTRS_turn_edit_straight_ALLin_4.7.json','Cirno_NTRS_turn_edit_straight_revise_4.7.json','Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json',
];
const g3forms = [
  'spawn=本轮黄毛在',
  'spawn =本轮黄毛在',
  'spawn= 本轮黄毛在',
  '**spawn=',
  '本轮黄毛在 {{user}} 当前场景画面内在场',
  '本轮黄毛在 {{user}} 当前场景画面内',
  '（或本轮新刷新进入画面）',
  '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**',
];
for (const f of files) {
  const raw = fs.readFileSync(dir + f, 'utf8');
  const hits = g3forms.map(g => [g, raw.split(g).length - 1]).filter(([, c]) => c > 0);
  console.log(f, '->', hits.length ? hits.map(([g, c]) => g + ':' + c).join(' | ') : 'NO G3-FORM HITS');
}
