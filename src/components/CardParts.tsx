import {motion} from 'framer-motion'
import {ArrowUpRight,Layers3,Award,BookOpen} from 'lucide-react'
import {type Card,type CardType,type Element,type Rarity} from '@/domain/cards'
import {useCopy} from '@/i18n/use-copy'

/**
 * One color per stat label so the same stat always reads the same way.
 * Keyed by the stable Indonesian label, with a text fallback for new labels.
 */
const STAT_COLORS:Record<string,string>={
  'HP':'#e0777d',
  'DMG':'#e08a5a',
  'Bonus DMG':'#f0b96b',
  'Sinergi DMG':'#ffd76e',
  'Biaya':'#7aa2e3',
  'Energy':'#63c6d4',
  'Sinergi Energy':'#8fe0e6',
  'Koin':'#c9b48a',
  'Stun':'#b096e6',
  'Balas DMG':'#e88970',
  'Abaikan Guard':'#d799cd',
  'Guard':'#5fc0a8',
  'Sinergi Guard':'#86d8c5',
  'Kartu':'#84c98f',
  'Serangan':'#e08fa8',
  'Giliran':'#a6adb8',
}

function statColor(label:{id:string;en:string}){
  const known=STAT_COLORS[label.id]
  if(known) return known
  const key=`${label.id} ${label.en}`.toLowerCase()
  if(key.includes('synergy guard')||key.includes('sinergi guard')) return '#86d8c5'
  if(key.includes('ignore guard')||key.includes('abaikan guard')) return '#d799cd'
  if(key.includes('guard')) return '#5fc0a8'
  if(key.includes('synergy energy')||key.includes('sinergi energy')) return '#8fe0e6'
  if(key.includes('energy')) return '#63c6d4'
  if(key.includes('counter')||key.includes('balas')) return '#e88970'
  if(key.includes('synergy dmg')||key.includes('sinergi dmg')) return '#ffd76e'
  if(key.includes('bonus')) return '#f0b96b'
  if(key.includes('dmg')||key.includes('attack')||key.includes('serangan')) return '#e08a5a'
  if(key.includes('hp')) return '#e0777d'
  if(key.includes('cost')||key.includes('biaya')) return '#7aa2e3'
  if(key.includes('coin')||key.includes('koin')) return '#c9b48a'
  if(key.includes('stun')) return '#b096e6'
  if(key.includes('card')||key.includes('kartu')) return '#84c98f'
  if(key.includes('turn')||key.includes('giliran')) return '#a6adb8'
  return '#d2af62'
}

function tint(hex:string,alpha:number){
  const n=parseInt(hex.slice(1),16)
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`
}

const RARITY_COLORS:Record<Rarity,string>= {
  common:'#9aa0a8',
  uncommon:'#5fc0a8',
  rare:'#7fca6f',
  epic:'#b096e6',
  secret:'#d2af62',
}

const TYPE_COLORS:Record<CardType,string>={
  energy:'#63c6d4',
  character:'#c38be8',
  power_up:'#e8b06a',
}

const ELEMENT_COLORS:Record<Element,string>={
  api:'#e0643f',
  air:'#5b9fd4',
  tanah:'#b08a5a',
}

export function rarityColor(rarity:Rarity){
  return RARITY_COLORS[rarity]
}

export function typeColor(type:CardType){
  return TYPE_COLORS[type]
}

export function elementColor(element:Element){
  return ELEMENT_COLORS[element]
}

function Chip({label,color,small}:{label:string;color?:string;small?:boolean}){
  return (
    <span style={{
      fontSize:9,
      padding:small?'2px 7px':'3px 8px',
      borderRadius:small?3:4,
      letterSpacing:'0.04em',
      textTransform:'uppercase',
      background:color?tint(color,.1):(small?'rgba(210,175,98,0.06)':'rgba(210,175,98,0.08)'),
      color:color??'#d2af62',
      border:`1px solid ${color?tint(color,.32):(small?'rgba(210,175,98,0.08)':'rgba(210,175,98,0.12)')}`,
    }}>
      {label}
    </span>
  )
}

function StatRow({stat,index}:{
  stat:{label:{id:string;en:string};value:number|string}
  index:number
}){
  const {locale}=useCopy()
  const isText=typeof stat.value==='string'
  const color=statColor(stat.label)
  return (
    <motion.div
      style={{
        background:tint(color,.07),
        border:`1px solid ${tint(color,.24)}`,
        borderRadius:5,
        padding:'7px 8px',
        display:'flex',
        flexDirection:'column',
        gap:2,
        transition:'border-color .3s ease',
      }}
      initial={{opacity:0,x:-12}}
      animate={{opacity:1,x:0}}
      transition={{delay:.14+index*.06,type:'spring',stiffness:320,damping:26}}
    >
      <span style={{
        fontSize:8,
        textTransform:'uppercase',
        letterSpacing:'0.07em',
        color:tint(color,.72),
      }}>{stat.label[locale]}</span>
      <span style={{
        fontFamily:'"Unbounded",sans-serif',
        fontSize:isText?12:17,
        fontWeight:700,
        color,
        lineHeight:1.3,
        overflowWrap:'anywhere',
      }}>{String(stat.value)}</span>
    </motion.div>
  )
}

function SplitPanel({
  card,
  kind,
  index,
}:{
  card:Card
  kind:'art'|'stats'|'rules'
  index:number
}){
  const {locale,t}=useCopy()
  const gradients={
    art:'rgba(210,175,98,0.08)',
    stats:'rgba(60,120,220,0.08)',
    rules:'rgba(40,170,90,0.08)',
  }
  const iconColors={
    art:'#d2af62',
    stats:'#5b8fd4',
    rules:'#4ab87a',
  }
  const Icon={art:Layers3,stats:Award,rules:BookOpen}[kind]
  const labels={art:t('cards'),stats:t('stats'),rules:t('rules')}

  return (
    <motion.div
      style={{
        borderRadius:11,
        overflow:'hidden',
        background:'linear-gradient(180deg,#1b1c20 0%,#131417 100%)',
        border:'1px solid rgba(44,45,49,0.6)',
        boxShadow:'0 8px 22px rgba(0,0,0,0.4)',
        display:'flex',
        flexDirection:'column',
        position:'relative',
        minHeight:kind==='stats'?140:200,
      }}
      initial={{opacity:0,scale:.85,y:28}}
      animate={{opacity:1,scale:1,y:0}}
      transition={{delay:.08+index*.09,type:'spring',stiffness:280,damping:26}}
      whileHover={index===1?{y:-4,scale:1.012}:undefined}
    >
      <div style={{
        display:'flex',
        alignItems:'center',
        gap:7,
        padding:'8px 12px',
        background:gradients[kind],
        borderBottom:'1px solid rgba(210,175,98,0.12)',
        fontSize:10,
        letterSpacing:'0.07em',
        textTransform:'uppercase',
        color:iconColors[kind],
        fontWeight:600,
      }}>
        <Icon size={16} style={{color:iconColors[kind],opacity:.85}}/>
        <span>{labels[kind]}</span>
      </div>

      {kind==='art'&&(
        <div style={{
          flex:1,
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          padding:18,
          textAlign:'center',
          gap:10,
          background:'radial-gradient(ellipse at 50% 30%,rgba(210,175,98,0.06) 0%,transparent 60%)',
        }}>
          {card.art?(
            <img
              src={card.art}
              alt={card.name[locale]}
              loading="lazy"
              style={{
                borderRadius:7,
                width:'100%',
                maxWidth:300,
                height:'auto',
                aspectRatio:'5/7',
                objectFit:'cover',
                border:'1px solid rgba(44,45,49,0.6)',
              }}
            />
          ):(
            <div style={{
              aspectRatio:'5/7',
              width:'100%',
              maxWidth:260,
              borderRadius:7,
              overflow:'hidden',
              background:'linear-gradient(135deg,#1c1d20,#151619)',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'center',
              gap:8,
              color:'#b5b2a9',
              fontSize:10,
              padding:10,
              textAlign:'center',
              border:'1px solid rgba(44,45,49,0.6)',
            }}>
              <span style={{
                fontFamily:'"Unbounded",sans-serif',
                fontSize:58,
                fontWeight:700,
                color:'#d2af62',
                opacity:.7,
                lineHeight:1,
              }}>?</span>
              <span style={{fontSize:10,color:'#85878b',letterSpacing:'0.04em'}}>{t('comingSoon')}</span>
            </div>
          )}
          <h3 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:14,
            fontWeight:600,
            color:'#ece9e2',
            letterSpacing:'-.02em',
            margin:'4px 0 0',
          }}>
            {card.name[locale]}
          </h3>
          <div style={{
            display:'flex',
            gap:6,
            justifyContent:'center',
            flexWrap:'wrap',
          }}>
            <Chip label={t(card.rarity)} color={rarityColor(card.rarity)}/>
            <Chip label={t(card.type)} color={typeColor(card.type)}/>
            {card.element&&<Chip label={t(card.element)} color={elementColor(card.element)}/>}
          </div>
        </div>
      )}

      {kind==='stats'&&(
        <div style={{
          flex:1,
          padding:13,
          display:'flex',
          flexDirection:'column',
          gap:9,
          background:'radial-gradient(ellipse at 80% 20%,rgba(60,120,220,0.04) 0%,transparent 50%)',
        }}>
          <dl style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,margin:0}}>
            {card.stats.map((stat,i)=>(
              <StatRow key={i} stat={stat} index={i}/>
            ))}
          </dl>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            <Chip small label={t(card.rarity)} color={rarityColor(card.rarity)}/>
            <Chip small label={t(card.type)} color={typeColor(card.type)}/>
            {card.element&&<Chip small label={t(card.element)} color={elementColor(card.element)}/>}
            <Chip small label={card.setCode}/>
          </div>
        </div>
      )}

      {kind==='rules'&&(
        <div style={{
          flex:1,
          padding:'12px 13px',
          display:'flex',
          flexDirection:'column',
          gap:7,
          overflow:'hidden',
          background:'radial-gradient(ellipse at 20% 80%,rgba(40,170,90,0.04) 0%,transparent 50%)',
        }}>
          <h4 style={{
            fontSize:10,
            textTransform:'uppercase',
            letterSpacing:'0.07em',
            color:'#d2af62',
            fontWeight:600,
            margin:0,
          }}>
            {t('rules')}
          </h4>
          <p style={{
            fontSize:11,
            lineHeight:1.65,
            color:'#b5b2a9',
            margin:0,
          }}>
            {card.rules[locale]}
          </p>
          <h4 style={{
            fontSize:10,
            textTransform:'uppercase',
            letterSpacing:'0.07em',
            color:'#d2af62',
            fontWeight:600,
            margin:'2px 0 0',
          }}>
            {card.type==='power_up'?t('rationale'):t('cardNote')}
          </h4>
          <p style={{
            fontSize:11,
            lineHeight:1.65,
            color:'#b5b2a9',
            margin:0,
          }}>
            {card.rationale[locale]}
          </p>
          <span style={{
            alignSelf:'flex-start',
            marginTop:5,
            fontSize:9,
            color:'#d2af62',
            background:'rgba(210,175,98,0.08)',
            padding:'2px 8px',
            borderRadius:3,
            letterSpacing:'0.04em',
          }}>
            {card.sourceGame}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export function CardOpener({card}:{card:Card}){
  return (
    <div className="card-opener flex flex-col gap-[20px] py-[24px] px-0">
      <div className="grid grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-[16px] items-start max-[767px]:grid-cols-[1fr] max-[767px]:gap-[12px]">
        <SplitPanel card={card} kind="art" index={0}/>
        <div className="flex flex-col gap-[16px] min-w-0">
          <SplitPanel card={card} kind="stats" index={1}/>
          <SplitPanel card={card} kind="rules" index={2}/>
        </div>
      </div>
    </div>
  )
}

export function CardTile({
  card,
  index,
  onSelect,
}:{
  card:Card
  index:number
  onSelect:(id:string)=>void
}){
  const {locale,t}=useCopy()
  return (
    <motion.button
      type="button"
      custom={index}
      onClick={()=>onSelect(card.id)}
      className="hover:bg-[#191b1f] [&_img]:aspect-[5/7] [&_img]:rounded-[8px] [&_img]:object-cover [&_img]:w-full [&_strong]:flex [&_strong]:items-center [&_strong]:justify-between [&_strong]:gap-[6px] [&_strong]:font-heading [&_strong]:text-[14px] [&_strong]:font-semibold [&_strong]:text-[var(--foreground)] [&_strong]:tracking-[-.03em] flex flex-col gap-[7px] p-[11px] bg-[linear-gradient(180deg,#17181b_0%,#121315_100%)] border border-[rgba(44,45,49,0.6)] rounded-[11px] text-left cursor-pointer transition-[border-color,box-shadow] duration-[.25s] hover:border-[rgba(210,175,98,0.35)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px] max-[767px]:p-[10px] max-[767px]:[&_strong]:text-[12px]"
      variants={tileVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      aria-label={`${card.name[locale]}, ${t(card.rarity)}. ${t('viewDetails')}`}
    >
      {card.art?(
        <img
          src={card.art}
          alt={card.name[locale]}
          loading="lazy"
          className="w-full h-auto aspect-[5/7] object-cover rounded-[7px] border border-[rgba(44,45,49,0.6)] bg-[linear-gradient(135deg,#1c1d20,#151619)]"
        />
      ):(
        <div className="w-full h-auto aspect-[5/7] object-cover rounded-[7px] border border-[rgba(44,45,49,0.6)] bg-[linear-gradient(135deg,#1c1d20,#151619)] flex flex-col items-center justify-center gap-[8px] text-[#85878b] text-[10px] p-[10px] text-center">
          <span className="font-heading text-[46px] font-bold leading-none text-[#d2af62] opacity-[.7]" aria-hidden="true">?</span>
          <span>{t('comingSoon')}</span>
        </div>
      )}
      <span className="text-[9px] text-[#85878b] uppercase tracking-[0.06em]">
        <span style={{color:rarityColor(card.rarity)}}>{t(card.rarity)}</span>
        {` / `}
        <span style={{color:typeColor(card.type)}}>{t(card.type)}</span>
        {card.element&&<>{` / `}<span style={{color:elementColor(card.element)}}>{t(card.element)}</span></>}
      </span>
      <strong className="flex items-center justify-between gap-[4px] font-heading text-[13px] font-semibold text-[#ece9e2] tracking-[-0.03em]">
        <span>{card.name[locale]}</span>
        <ArrowUpRight aria-hidden="true" size={16} style={{color:'#d2af62',opacity:.6}}/>
      </strong>
      <span className="font-heading text-[10px] text-[#d2af62] tracking-[0.03em]">{card.setCode}</span>
    </motion.button>
  )
}

const tileVariants={
  hidden:{opacity:0,y:18,scale:0.95},
  visible:(i:number)=>({
    opacity:1,
    y:0,
    scale:1,
    transition:{
      type:'spring' as const,
      stiffness:260,
      damping:24,
      delay:0.04+i*0.045,
    },
  }),
  hover:{
    y:-6,
    scale:1.02,
    boxShadow:'0 12px 24px rgba(0,0,0,0.5)',
    transition:{type:'spring' as const,stiffness:350,damping:22},
  },
  tap:{scale:0.97,transition:{duration:.08}},
}
