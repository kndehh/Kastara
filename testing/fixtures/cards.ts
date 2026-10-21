import type { Card } from '@/domain/cards'
// Synthetic test-only records. These are not approved Kastara cards.
export const cards:Card[] = [
 {id:'test-b',name:{id:'Beta uji',en:'Beta test'},rarity:'epic',type:'power_up',sourceGame:'Gundu',setCode:'TEST-02',rules:{id:'Aturan uji B',en:'Test rule B'},rationale:{id:'Alasan uji',en:'Test rationale'},art:null,stats:[{label:{id:'Biaya',en:'Cost'},value:2}]},
 {id:'test-a',name:{id:'Alfa uji',en:'Alpha test'},rarity:'common',type:'power_up',sourceGame:'Congklak',setCode:'TEST-01',rules:{id:'Aturan uji A',en:'Test rule A'},rationale:{id:'Alasan uji',en:'Test rationale'},art:null,stats:[]},
 {id:'test-c',name:{id:'Alfa uji',en:'Alpha test'},rarity:'rare',type:'character',sourceGame:'Egrang',setCode:'TEST-01',rules:{id:'Aturan uji C',en:'Test rule C'},rationale:{id:'Alasan uji',en:'Test rationale'},art:null,stats:[]}
]
