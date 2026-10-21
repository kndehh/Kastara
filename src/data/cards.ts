import type {Card,SourceGame} from '@/domain/cards'

const label={
  hp:{id:'HP',en:'HP'},
  dmg:{id:'DMG',en:'DMG'},
  cost:{id:'Biaya',en:'Cost'},
  bonus:{id:'Bonus DMG',en:'DMG bonus'},
  synergyDmg:{id:'Sinergi DMG',en:'Synergy DMG'},
  coin:{id:'Koin',en:'Coins'},
  stun:{id:'Stun',en:'Stun'},
  counter:{id:'Balas DMG',en:'Counter DMG'},
  ignoreGuard:{id:'Abaikan Guard',en:'Ignore Guard'},
  turns:{id:'Giliran',en:'Turns'},
  energy:{id:'Energy',en:'Energy'},
  synergyEnergy:{id:'Sinergi Energy',en:'Synergy Energy'},
  cards:{id:'Kartu',en:'Cards'},
  attacks:{id:'Serangan',en:'Attacks'},
  guard:{id:'Guard',en:'Guard'},
  synergyGuard:{id:'Sinergi Guard',en:'Synergy Guard'},
}

export const sourceGameOptions:readonly SourceGame[]=[
  'Gundu','Gasing','Egrang','Layangan','Petak Umpet','Congklak','Bekel','Gobak Sodor',
]

export const publishedCards:readonly Card[]=[
  {
    id:'kst-arka',
    name:{id:'Arka, Sang Penyentil',en:'Arka, Sang Penyentil'},
    rarity:'rare',
    type:'character',
    sourceGame:'Kastara',
    element:'api',
    hp:90,
    dmg:30,
    attackCost:['api','any'],
    setCode:'KST-001',
    rules:{
      id:'Precision Flick: serangan pertama tiap giliran +10 DMG.',
      en:'Precision Flick: the first attack each turn gets +10 DMG.'
    },
    rationale:{
      id:'Sekali sentil, sekali menang.',
      en:'One flick, one finish.'
    },
    art:'/cards/arka.webp',
    stats:[
      {label:label.hp,value:90},
      {label:label.dmg,value:30},
      {label:label.cost,value:2}
    ]
  },
  {
    id:'kst-laras',
    name:{id:'Laras, Si Langkah Tinggi',en:'Laras, Si Langkah Tinggi'},
    rarity:'common',
    type:'character',
    sourceGame:'Kastara',
    element:'air',
    hp:70,
    dmg:20,
    attackCost:['air'],
    setCode:'KST-002',
    rules:{
      id:'Elevated Stance: lempar 2 koin. Jika keduanya Heads, hindari serangan.',
      en:'Elevated Stance: flip 2 coins. If both are Heads, dodge the attack.'
    },
    rationale:{
      id:'Setiap langkah adalah jalan pulang.',
      en:'Every step is a way home.'
    },
    art:'/cards/laras.webp',
    stats:[
      {label:label.hp,value:70},
      {label:label.dmg,value:20},
      {label:label.cost,value:1}
    ]
  },
  {
    id:'kst-gundu',
    name:{id:'Gundu',en:'Gundu'},
    rarity:'common',
    type:'power_up',
    sourceGame:'Gundu',
    element:'api',
    setCode:'KST-003',
    rules:{
      id:'Efek dasar: +10 DMG. Sinergi Api: +25 DMG dan serangan pertama tiap giliran tidak bisa dihindari.',
      en:'Basic: +10 DMG. Fire synergy: +25 DMG and the first attack each turn cannot be dodged.'
    },
    rationale:{
      id:'Kelereng disentil tepat ke sasaran.',
      en:'A marble flicked straight at the target.'
    },
    art:'/cards/gundu.webp',
    stats:[
      {label:label.bonus,value:10},
      {label:label.synergyDmg,value:25}
    ]
  },
  {
    id:'kst-egrang',
    name:{id:'Egrang',en:'Egrang'},
    rarity:'common',
    type:'power_up',
    sourceGame:'Egrang',
    element:'air',
    setCode:'KST-004',
    rules:{
      id:'Efek dasar: lempar 2 koin, jika keduanya Heads hindari serangan. Sinergi Air: lempar 1 koin, jika Heads hindari serangan dan balas 10 DMG.',
      en:'Basic: flip 2 coins, dodge if both are Heads. Water synergy: flip 1 coin, dodge and deal 10 DMG back if Heads.'
    },
    rationale:{
      id:'Berdiri di atas bambu tinggi, lebih sulit dijatuhkan.',
      en:'Standing tall on bamboo makes you harder to topple.'
    },
    art:'/cards/egrang.webp',
    stats:[
      {label:label.coin,value:2},
      {label:label.counter,value:10}
    ]
  },
  {
    id:'kst-api',
    name:{id:'API',en:'API'},
    rarity:'common',
    type:'energy',
    sourceGame:'Energy',
    element:'api',
    setCode:'KST-005',
    rules:{
      id:'Bahan bakar serangan. Dipasang ke Character lalu dikonsumsi saat menyerang.',
      en:'Attack fuel. Attach it to a character, then consume it to attack.'
    },
    rationale:{
      id:'Energy dasar bertema daya dan benturan.',
      en:'A basic Energy card built around force and impact.'
    },
    art:'/cards/api.webp',
    stats:[]
  },
  {
    id:'kst-sekar',
    name:{id:'Sekar, Sang Pemanen',en:'Sekar, Sang Pemanen'},
    rarity:'uncommon',
    type:'character',
    sourceGame:'Kastara',
    element:'tanah',
    hp:80,
    dmg:20,
    attackCost:['tanah','any'],
    setCode:'KST-006',
    rules:{
      id:'Panen: saat menyerang, pasang 1 Energy dari discard pile ke Character ini.',
      en:'Harvest: when it attacks, attach 1 Energy from the discard pile to this character.'
    },
    rationale:{
      id:'Panen datang ke yang sabar merawat.',
      en:'The harvest comes to those who tend it patiently.'
    },
    art:'/cards/sekar.webp',
    stats:[
      {label:label.hp,value:80},
      {label:label.dmg,value:20},
      {label:label.cost,value:2}
    ]
  },
  {
    id:'kst-congklak',
    name:{id:'Congklak',en:'Congklak'},
    rarity:'uncommon',
    type:'power_up',
    sourceGame:'Congklak',
    element:'tanah',
    setCode:'KST-007',
    rules:{
      id:'Efek dasar: di awal giliranmu, pasang +1 Energy ke Character ini. Sinergi Tanah: +2 Energy per giliran.',
      en:'Basic: at the start of your turn, attach +1 Energy to this character. Earth synergy: +2 Energy per turn.'
    },
    rationale:{
      id:'Biji dikumpulkan satu per satu, bertahap.',
      en:'Beads are gathered one by one, step by step.'
    },
    art:'/cards/congklak.webp',
    stats:[
      {label:label.energy,value:1},
      {label:label.synergyEnergy,value:2}
    ]
  },
  {
    id:'kst-petak-umpet',
    name:{id:'Petak Umpet',en:'Petak Umpet'},
    rarity:'common',
    type:'power_up',
    sourceGame:'Petak Umpet',
    element:'air',
    setCode:'KST-008',
    rules:{
      id:'Sekali pakai. Efek dasar: tidak bisa ditarget selama 1 giliran lawan. Sinergi Air: 2 giliran, lalu serangan pertama +20 DMG.',
      en:'Single use. Basic: cannot be targeted for 1 opponent turn. Water synergy: 2 turns, then the first attack gets +20 DMG.'
    },
    rationale:{
      id:'Bersembunyi sampai lawan berhenti mencari.',
      en:'Hide until the seeker gives up.'
    },
    art:'/cards/petak-umpet.webp',
    stats:[
      {label:label.turns,value:1},
      {label:label.bonus,value:20}
    ]
  },
  {
    id:'kst-air',
    name:{id:'AIR',en:'AIR'},
    rarity:'common',
    type:'energy',
    sourceGame:'Energy',
    element:'air',
    setCode:'KST-009',
    rules:{
      id:'Bahan bakar serangan. Dipasang ke Character lalu dikonsumsi saat menyerang.',
      en:'Attack fuel. Attach it to a character, then consume it to attack.'
    },
    rationale:{
      id:'Energy dasar bertema gesit dan sulit ditangkap.',
      en:'A basic Energy card built around speed and slipping away.'
    },
    art:'/cards/air.webp',
    stats:[]
  },
  {
    id:'kst-tanah',
    name:{id:'TANAH',en:'TANAH'},
    rarity:'common',
    type:'energy',
    sourceGame:'Energy',
    element:'tanah',
    setCode:'KST-010',
    rules:{
      id:'Bahan bakar serangan. Dipasang ke Character lalu dikonsumsi saat menyerang.',
      en:'Attack fuel. Attach it to a character, then consume it to attack.'
    },
    rationale:{
      id:'Energy dasar bertema akal dan akumulasi.',
      en:'A basic Energy card built around cunning and buildup.'
    },
    art:'/cards/tanah.webp',
    stats:[]
  },
  {
    id:'kst-dahana',
    name:{id:'Dahana, Si Tameng Bara',en:'Dahana, Si Tameng Bara'},
    rarity:'uncommon',
    type:'character',
    sourceGame:'Kastara',
    element:'api',
    hp:110,
    dmg:20,
    attackCost:['any'],
    setCode:'KST-011',
    rules:{
      id:'Tangguh: damage yang diterima -10.',
      en:'Sturdy: damage taken is reduced by 10.'
    },
    rationale:{
      id:'Dia maju duluan supaya yang lain aman.',
      en:'He steps up first so the others stay safe.'
    },
    art:null,
    stats:[
      {label:label.hp,value:110},
      {label:label.dmg,value:20},
      {label:label.cost,value:1}
    ]
  },
  {
    id:'kst-geledek',
    name:{id:'Geledek, Sang Penghantam',en:'Geledek, Sang Penghantam'},
    rarity:'epic',
    type:'character',
    sourceGame:'Kastara',
    element:'api',
    hp:70,
    dmg:40,
    attackCost:['api','api'],
    setCode:'KST-012',
    rules:{
      id:'Overdrive: jika membayar 2 Energy, +10 DMG.',
      en:'Overdrive: if you pay 2 Energy, +10 DMG.'
    },
    rationale:{
      id:'Sekali hantam, porak poranda.',
      en:'One hit, total wreck.'
    },
    art:null,
    stats:[
      {label:label.hp,value:70},
      {label:label.dmg,value:40},
      {label:label.cost,value:2}
    ]
  },
  {
    id:'kst-arus',
    name:{id:'Arus, Si Penyelinap',en:'Arus, Si Penyelinap'},
    rarity:'uncommon',
    type:'character',
    sourceGame:'Kastara',
    element:'air',
    hp:80,
    dmg:25,
    attackCost:['air','any'],
    setCode:'KST-013',
    rules:{
      id:'Slip Away: sekali per giliran, tukar posisi dengan Bench tanpa biaya.',
      en:'Slip Away: once per turn, swap with a benched character for free.'
    },
    rationale:{
      id:'Kalau arusnya deras, jangan coba tahan.',
      en:'When the current runs fast, do not try to hold it.'
    },
    art:null,
    stats:[
      {label:label.hp,value:80},
      {label:label.dmg,value:25},
      {label:label.cost,value:2}
    ]
  },
  {
    id:'kst-tupai',
    name:{id:'Tupai, Si Tangan Panjang',en:'Tupai, Si Tangan Panjang'},
    rarity:'common',
    type:'character',
    sourceGame:'Kastara',
    element:'air',
    hp:60,
    dmg:25,
    attackCost:['air'],
    setCode:'KST-014',
    rules:{
      id:'Pickpocket: saat menyerang, lawan membuang 1 kartu tangan acak.',
      en:'Pickpocket: when it attacks, the opponent discards 1 random card from hand.'
    },
    rationale:{
      id:'Tangan cepat, langkah ringan.',
      en:'Quick hands, light feet.'
    },
    art:null,
    stats:[
      {label:label.hp,value:60},
      {label:label.dmg,value:25},
      {label:label.cost,value:1}
    ]
  },
  {
    id:'kst-gapura',
    name:{id:'Gapura, Penjaga Garis',en:'Gapura, Penjaga Garis'},
    rarity:'uncommon',
    type:'character',
    sourceGame:'Kastara',
    element:'tanah',
    hp:100,
    dmg:15,
    attackCost:['tanah'],
    setCode:'KST-015',
    rules:{
      id:'Pagar: Character Bench-mu menerima damage -10.',
      en:'Fence: your benched characters take 10 less damage.'
    },
    rationale:{
      id:'Garis dijaga, kampung aman.',
      en:'Hold the line and the village stays safe.'
    },
    art:null,
    stats:[
      {label:label.hp,value:100},
      {label:label.dmg,value:15},
      {label:label.cost,value:1}
    ]
  },
  {
    id:'kst-gasing',
    name:{id:'Gasing',en:'Gasing'},
    rarity:'common',
    type:'power_up',
    sourceGame:'Gasing',
    element:'api',
    setCode:'KST-016',
    rules:{
      id:'Efek dasar: lempar 1 koin, jika Heads target Stun. Sinergi Api: target pasti Stun dan tidak bisa tukar posisi.',
      en:'Basic: flip 1 coin, the target is Stunned on Heads. Fire synergy: the target is always Stunned and cannot swap positions.'
    },
    rationale:{
      id:'Gasing beradu sampai lawan terlempar dari poros.',
      en:'Tops clash until the other is knocked off its axis.'
    },
    art:null,
    stats:[
      {label:label.coin,value:1},
      {label:label.stun,value:1}
    ]
  },
  {
    id:'kst-layangan',
    name:{id:'Layangan',en:'Layangan'},
    rarity:'rare',
    type:'power_up',
    sourceGame:'Layangan',
    element:'air',
    setCode:'KST-017',
    rules:{
      id:'Efek dasar: serangan boleh menarget Character Bench lawan. Sinergi Air: +10 DMG dan serangan mengabaikan Guard.',
      en:'Basic: your attack may target a benched opposing character. Water synergy: +10 DMG and the attack ignores Guard.'
    },
    rationale:{
      id:'Layangan diterbangkan jauh, benang lawan diputus.',
      en:'A kite flown far away can cut the other string.'
    },
    art:null,
    stats:[
      {label:label.bonus,value:10},
      {label:label.ignoreGuard,value:1}
    ]
  },
  {
    id:'kst-bekel',
    name:{id:'Bekel',en:'Bekel'},
    rarity:'rare',
    type:'power_up',
    sourceGame:'Bekel',
    element:'tanah',
    setCode:'KST-018',
    rules:{
      id:'Efek dasar: tiap Powerup lain dipasang ke Character ini, tarik 1 kartu. Sinergi Tanah: menyerang 2x per giliran, serangan kedua biaya 0.',
      en:'Basic: whenever another Powerup is attached to this character, draw 1 card. Earth synergy: attack twice per turn, the second attack costs 0.'
    },
    rationale:{
      id:'Bola ditangkap sambil mengambil biji dalam satu gerakan.',
      en:'Catch the ball and grab a stone in one motion.'
    },
    art:null,
    stats:[
      {label:label.cards,value:1},
      {label:label.attacks,value:2}
    ]
  },
  {
    id:'kst-gobak-sodor',
    name:{id:'Gobak Sodor',en:'Gobak Sodor'},
    rarity:'rare',
    type:'power_up',
    sourceGame:'Gobak Sodor',
    element:'tanah',
    setCode:'KST-019',
    rules:{
      id:'Efek dasar: Guard, damage yang diterima -10. Sinergi Tanah: Guard -20 dan Character Bench-mu juga -10.',
      en:'Basic: Guard, damage taken is reduced by 10. Earth synergy: Guard 20 and your benched characters also take 10 less.'
    },
    rationale:{
      id:'Garis dijaga supaya lawan tidak bisa lewat.',
      en:'Guard the line so the opponent cannot pass.'
    },
    art:null,
    stats:[
      {label:label.guard,value:10},
      {label:label.synergyGuard,value:20}
    ]
  },
]
