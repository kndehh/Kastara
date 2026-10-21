import {motion,useReducedMotion} from 'framer-motion'
import {Layers3,Hand,Trash2,Swords,Sofa} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'
import type {Dictionary} from '@/i18n'

const ARENA_SLOTS=1
const BENCH_SLOTS=2

type ZoneKey='deck'|'hand'|'discard'|'arena'|'bench'

const ZONES:ReadonlyArray<{
  key:ZoneKey
  icon:typeof Layers3
  labelKey:keyof Dictionary
  copyKey:keyof Dictionary
  tone:string
  count:number
}>=[
  {key:'deck',icon:Layers3,labelKey:'mapDeck',copyKey:'mapDeckCopy',tone:'deck',count:5},
  {key:'hand',icon:Hand,labelKey:'mapHand',copyKey:'mapHandCopy',tone:'hand',count:5},
  {key:'discard',icon:Trash2,labelKey:'mapDiscard',copyKey:'mapDiscardCopy',tone:'discard',count:2},
  {key:'arena',icon:Swords,labelKey:'mapArena',copyKey:'mapArenaCopy',tone:'arena',count:ARENA_SLOTS},
  {key:'bench',icon:Sofa,labelKey:'mapBench',copyKey:'mapBenchCopy',tone:'bench',count:BENCH_SLOTS},
]

function FaceDown({tone,slotIndex}:{
  tone:string
  slotIndex:number
}){
  const reduce=useReducedMotion()
  return (
    <motion.span
      className="block w-[30px] h-[42px] rounded-[4px] border border-[rgba(44,45,49,0.7)] relative overflow-hidden after:content-[''] after:absolute after:inset-[4px] after:rounded-[2px] after:border after:border-[currentColor] after:opacity-[.25] data-[tone=deck]:bg-[linear-gradient(160deg,#1e1f23,#151619)] data-[tone=deck]:text-[#8a8c90] data-[tone=hand]:bg-[linear-gradient(160deg,#232429,#191a1d)] data-[tone=hand]:text-[#b5b2a9] data-[tone=point]:bg-[linear-gradient(160deg,#2a2318,#1a1712)] data-[tone=point]:text-[#d2af62] data-[tone=discard]:bg-[linear-gradient(160deg,#1c1d20,#131417)] data-[tone=discard]:text-[#5d5f63] data-[tone=arena]:bg-[linear-gradient(160deg,#1c2a22,#131a16)] data-[tone=arena]:text-[#4ab87a] data-[tone=arena]:w-[38px] data-[tone=arena]:h-[52px] data-[tone=bench]:bg-[linear-gradient(160deg,#221f2a,#161419)] data-[tone=bench]:text-[#8f8aa0] data-[tone=bench]:w-[34px] data-[tone=bench]:h-[48px]"
      data-tone={tone}
      animate={reduce?undefined:{y:[0,-3,0]}}
      transition={{duration:2.4,repeat:Infinity,delay:slotIndex*.18,ease:'easeInOut'}}
    />
  )
}

function Zone({zone,index}:{
  zone:typeof ZONES[number]
  index:number
}){
  const {t}=useCopy()
  const Icon=zone.icon

  return (
    <motion.div
      className="p-[16px] bg-[linear-gradient(180deg,#17181b_0%,#121315_100%)] border border-[rgba(44,45,49,0.6)] rounded-[11px]"
      initial={{opacity:0,y:14}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true,margin:'-40px'}}
      transition={{duration:.4,delay:index*.06,ease:'easeOut'}}
    >
      <div className="flex items-center gap-[8px] text-[#d2af62] [&_h3]:font-heading [&_h3]:text-[12px] [&_h3]:font-medium [&_h3]:text-[#ece9e2] [&_h3]:m-0 [&_h3]:[flex:1] [&_h3]:tracking-[-.02em]">
        <Icon aria-hidden="true" size={15} strokeWidth={1.6}/>
        <h3>{t(zone.labelKey)}</h3>
        <span className="font-heading text-[10px] text-[#85878b]">{zone.count}</span>
      </div>
      <div className="flex gap-[6px] flex-wrap min-h-[52px] items-center mt-[13px] mx-0 mb-[11px]" data-zone={zone.key}>
        {Array.from({length:zone.count},(_,i)=>(
          <FaceDown key={i} tone={zone.tone} slotIndex={i}/>
        ))}
      </div>
      <p className="text-[11px] leading-[1.65] text-[#8b8d91] m-0">{t(zone.copyKey)}</p>
    </motion.div>
  )
}

export function MapGuide(){
  const {t}=useCopy()

  return (
    <section id="peta" className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] py-[92px] px-0 border-b border-[#26272b] max-[767px]:py-[62px] max-[767px]:px-0 py-[92px] px-0" aria-labelledby="map-title">
      <div className="max-w-[730px] mb-[38px] [&_p]:mt-[18px] [&_p]:max-w-[650px] max-[767px]:mb-[30px] max-[767px]:[&_p]:text-[13px]">
        <h2 id="map-title" style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:'clamp(25px, 3vw, 37px)',
          fontWeight:500,
          lineHeight:1.3,
          letterSpacing:'-.045em',
          textWrap:'balance',
          color:'#ece9e2',
          margin:0,
        }}>
          {t('mapTitle')}
        </h2>
        <p style={{
          marginTop:18,
          maxWidth:650,
          color:'#b5b2a9',
          fontSize:15,
          lineHeight:1.7,
        }}>
          {t('mapCopy')}
        </p>
      </div>

      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[14px] mt-[34px]" role="list">
        <motion.div
          className="flex gap-[12px] p-[16px] bg-[linear-gradient(180deg,rgba(23,24,27,0.7)_0%,rgba(18,19,21,0.7)_100%)] border border-[rgba(44,45,49,0.6)] rounded-[10px] [&_div]:flex [&_div]:flex-col [&_div]:gap-[5px] [&_strong]:font-heading [&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:text-[#ece9e2] [&_span]:text-[11px] [&_span]:leading-[1.65] [&_span]:text-[#8b8d91]"
          role="listitem"
          initial={{opacity:0,y:12}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4}}
        >
          <span className="shrink-[0] grid place-items-center w-[24px] h-[24px] rounded-full bg-[rgba(210,175,98,0.1)] border border-[rgba(210,175,98,0.25)] text-[#d2af62] font-heading text-[11px] font-semibold">1</span>
          <div>
            <strong>{t('mapSetup1Title')}</strong>
            <span>{t('mapSetup1Copy')}</span>
          </div>
        </motion.div>
        <motion.div
          className="flex gap-[12px] p-[16px] bg-[linear-gradient(180deg,rgba(23,24,27,0.7)_0%,rgba(18,19,21,0.7)_100%)] border border-[rgba(44,45,49,0.6)] rounded-[10px] [&_div]:flex [&_div]:flex-col [&_div]:gap-[5px] [&_strong]:font-heading [&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:text-[#ece9e2] [&_span]:text-[11px] [&_span]:leading-[1.65] [&_span]:text-[#8b8d91]"
          role="listitem"
          initial={{opacity:0,y:12}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4,delay:.08}}
        >
          <span className="shrink-[0] grid place-items-center w-[24px] h-[24px] rounded-full bg-[rgba(210,175,98,0.1)] border border-[rgba(210,175,98,0.25)] text-[#d2af62] font-heading text-[11px] font-semibold">2</span>
          <div>
            <strong>{t('mapSetup2Title')}</strong>
            <span>{t('mapSetup2Copy')}</span>
          </div>
        </motion.div>
        <motion.div
          className="flex gap-[12px] p-[16px] bg-[linear-gradient(180deg,rgba(23,24,27,0.7)_0%,rgba(18,19,21,0.7)_100%)] border border-[rgba(44,45,49,0.6)] rounded-[10px] [&_div]:flex [&_div]:flex-col [&_div]:gap-[5px] [&_strong]:font-heading [&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:text-[#ece9e2] [&_span]:text-[11px] [&_span]:leading-[1.65] [&_span]:text-[#8b8d91]"
          role="listitem"
          initial={{opacity:0,y:12}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4,delay:.16}}
        >
          <span className="shrink-[0] grid place-items-center w-[24px] h-[24px] rounded-full bg-[rgba(210,175,98,0.1)] border border-[rgba(210,175,98,0.25)] text-[#d2af62] font-heading text-[11px] font-semibold">3</span>
          <div>
            <strong>{t('mapSetup3Title')}</strong>
            <span>{t('mapSetup3Copy')}</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[14px] mt-[14px]">
        {ZONES.map((z,i)=>(
          <Zone key={z.key} zone={z} index={i}/>
        ))}
      </div>

      <p className="mt-[18px] mx-0 mb-0 text-[11px] text-[#8f8f95] leading-[1.6]">{t('mapNote')}</p>
    </section>
  )
}
