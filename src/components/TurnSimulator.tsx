import {useRef,useState} from 'react'
import {motion,AnimatePresence,useReducedMotion} from 'framer-motion'
import {AlertTriangle,ArrowLeftRight,Battery,Check,Compass,Hand,Layers,RotateCw,Sparkles,Swords,Target,Zap} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'
import {publishedCards} from '@/data/cards'
import {SimResultBanner} from '@/components/SimResultBanner'
import type {Card,Element} from '@/domain/cards'

function byId(id:string):Card{
  const found=publishedCards.find(card=>card.id===id)
  if(!found) throw new Error(`Simulator card missing: ${id}`)
  return found
}

const KO_TO_WIN=3
const ELEMENT_HEX:Record<Element,string>={api:'#e0643f',air:'#5b9fd4',tanah:'#b08a5a'}
const TOUR_KEY='kastara:sim-tour-done'
const GLOW_SHADOW='0 0 0 2px rgba(210,175,98,0.8), 0 0 18px rgba(210,175,98,0.4)'
type FlowStep={label:string;done:boolean;current:boolean;optional?:boolean}
/** Single source of truth: the guide text and the glow target both come from here. */
type Suggestion={
  kind:'deploy'|'attach'|'powerup'|'attack'|'end'|'none'
  text:string
  /** Index of the highlighted card in hand, so only one copy glows. */
  cardIndex:number|null
  strike:boolean
  end:boolean
}
const PLAYER_START=byId('kst-laras')
const RIVAL_ROSTER:readonly Card[]=[byId('kst-sekar'),byId('kst-arka'),byId('kst-laras')]
const OPENING_HAND:readonly Card[]=[
  byId('kst-arka'),
  byId('kst-gundu'),
  byId('kst-egrang'),
  byId('kst-api'),
  byId('kst-air'),
  byId('kst-air'),
]

/** Replaces {name}-style placeholders in a translation. */
function fill(template:string,vars:Record<string,string>){
  return template.replace(/\{(\w+)\}/g,(_,key:string)=>vars[key]??'')
}

type Unit={
  card:Card
  hp:number
  maxHp:number
  energy:Card[]
  powerups:Card[]
  ward:number
}

type Phase='playing'|'won'|'lost'
type LogKind='info'|'hit'|'hurt'|'good'
type LogLine={id:number;kind:LogKind;text:string}
type Pop={id:number;target:'rival'|'hero';value:number}

type SimState={
  deck:Card[]
  hand:Card[]
  discard:Card[]
  active:Unit|null
  bench:Unit[]
  rival:Unit
  rivalIndex:number
  turn:number
  energyUsed:boolean
  powerupUsed:boolean
  attacked:boolean
  ko:number
  phase:Phase
  log:LogLine[]
  nextLog:number
}

function unitFrom(card:Card):Unit{
  const hp=card.hp??70
  return {card,hp,maxHp:hp,energy:[],powerups:[],ward:0}
}

function copies(card:Card,count:number):Card[]{
  return Array.from({length:count},()=>card)
}

function buildDeck():Card[]{
  return [
    ...copies(byId('kst-laras'),3),
    ...copies(byId('kst-arka'),3),
    ...copies(byId('kst-sekar'),2),
    ...copies(byId('kst-gundu'),2),
    ...copies(byId('kst-egrang'),2),
    ...copies(byId('kst-congklak'),2),
    ...copies(byId('kst-petak-umpet'),2),
    ...copies(byId('kst-api'),6),
    ...copies(byId('kst-air'),6),
    ...copies(byId('kst-tanah'),2),
  ]
}

function shuffle<T>(items:T[]):T[]{
  const out=[...items]
  for(let i=out.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1))
    ;[out[i],out[j]]=[out[j],out[i]]
  }
  return out
}

function takeFirst(deck:Card[],id:string):Card[]{
  const index=deck.findIndex(card=>card.id===id)
  if(index<0) return deck
  return [...deck.slice(0,index),...deck.slice(index+1)]
}

function removeFirst(hand:Card[],id:string):Card[]{
  const index=hand.findIndex(card=>card.id===id)
  if(index<0) return hand
  return [...hand.slice(0,index),...hand.slice(index+1)]
}

function makeInitialState():SimState{
  let deck=shuffle(buildDeck())
  for(const id of ['kst-laras','kst-arka','kst-gundu','kst-egrang','kst-api','kst-air','kst-air']){
    deck=takeFirst(deck,id)
  }
  return {
    deck,
    hand:[...OPENING_HAND],
    discard:[],
    active:unitFrom(PLAYER_START),
    bench:[],
    rival:unitFrom(RIVAL_ROSTER[0]),
    rivalIndex:0,
    turn:1,
    energyUsed:false,
    powerupUsed:false,
    attacked:false,
    ko:0,
    phase:'playing',
    log:[],
    nextLog:1,
  }
}

function addLog(state:SimState,kind:LogKind,text:string):SimState{
  return {
    ...state,
    log:[{id:state.nextLog,kind,text},...state.log].slice(0,6),
    nextLog:state.nextLog+1,
  }
}

function payEnergy(energy:Card[],cost:ReadonlyArray<Element|'any'>):{spent:Card[];remaining:Card[]}|null{
  const pool=[...energy]
  const spent:Card[]=[]
  for(const token of cost){
    if(token==='any') continue
    const index=pool.findIndex(card=>card.element===token)
    if(index<0) return null
    spent.push(...pool.splice(index,1))
  }
  for(const token of cost){
    if(token!=='any') continue
    if(pool.length===0) return null
    spent.push(...pool.splice(0,1))
  }
  return {spent,remaining:pool}
}

export function TurnSimulator({bare=false}:{bare?:boolean}){
  const {t,locale}=useCopy()
  const reduce=useReducedMotion()
  const [state,setState]=useState<SimState>(makeInitialState)
  const [status,setStatus]=useState<string|null>(null)
  const [pops,setPops]=useState<Pop[]>([])
  const popId=useRef(1)
  const [tourOpen,setTourOpen]=useState<boolean>(()=>{
    try{
      if(localStorage.getItem(TOUR_KEY)) return false
    }catch{/* storage may be blocked */}
    return true
  })
  // The result lives on the board itself, where the player is already looking.
  const [resultDismissed,setResultDismissed]=useState(false)

  /** Hide the coach for now; it comes back on the next visit. */
  function dismissTour(){
    setTourOpen(false)
  }

  /** Hide the coach for good and remember the choice. */
  function skipTour(){
    setTourOpen(false)
    try{localStorage.setItem(TOUR_KEY,'1')}catch{/* storage may be blocked */}
  }

  function playAgain(){
    reset()
  }

  function pop(target:Pop['target'],value:number){
    const id=popId.current++
    setPops(prev=>[...prev,{id,target,value}])
    window.setTimeout(()=>{
      setPops(prev=>prev.filter(item=>item.id!==id))
    },1000)
  }

  function damageRival(current:SimState,damage:number):SimState{
    const hp=Math.max(0,current.rival.hp-damage)
    let next:SimState={...current,rival:{...current.rival,hp}}
    if(hp>0) return next

    const ko=current.ko+1
    const rivalName=current.rival.card.name[locale]
    if(ko>=KO_TO_WIN||current.rivalIndex+1>=RIVAL_ROSTER.length){
      return addLog({...next,ko,phase:'won'},'good',`${rivalName} ${t('simLogKO')} ${t('simWin')}`)
    }
    const rivalIndex=current.rivalIndex+1
    next={...next,ko,rivalIndex,rival:unitFrom(RIVAL_ROSTER[rivalIndex])}
    return addLog(next,'good',`${rivalName} ${t('simLogKO')} ${t('simLogNextRival')}`)
  }

  function damagePlayer(current:SimState,damage:number):SimState{
    if(!current.active) return current
    const hp=Math.max(0,current.active.hp-damage)
    const next:SimState={...current,active:{...current.active,hp}}
    if(hp>0) return next

    const lost=[...current.active.energy,...current.active.powerups]
    const bench=[...current.bench]
    if(bench.length>0){
      const promoted=bench.shift()!
      return addLog(
        {...next,bench,active:promoted,discard:[...next.discard,...lost]},
        'info',
        `${promoted.card.name[locale]} ${t('simLogPromote')}`,
      )
    }
    const handIndex=next.hand.findIndex(card=>card.type==='character')
    if(handIndex>=0){
      const card=next.hand[handIndex]
      return addLog(
        {
          ...next,
          hand:next.hand.filter((_,index)=>index!==handIndex),
          active:unitFrom(card),
          discard:[...next.discard,...lost],
        },
        'info',
        `${card.name[locale]} ${t('simLogHandPromote')}`,
      )
    }
    return addLog(
      {...next,active:null,discard:[...next.discard,...lost],phase:'lost'},
      'hurt',
      t('simLose'),
    )
  }

  function drawOne(current:SimState):SimState{
    if(current.deck.length===0) return addLog({...current,phase:'lost'},'hurt',t('simLogDeckOut'))
    const card=current.deck[0]
    return addLog(
      {...current,deck:current.deck.slice(1),hand:[...current.hand,card]},
      'info',
      `${t('simLogDraw')} ${card.name[locale]}`,
    )
  }

  function applyCongklak(current:SimState):SimState{
    const congklak=current.active?.powerups.find(card=>card.id==='kst-congklak')
    if(!current.active||!congklak) return current
    const synergy=congklak.element===current.active.card.element
    const amount=synergy?2:1
    const element=current.active.card.element??'api'
    const card=byId(element==='api'?'kst-api':element==='air'?'kst-air':'kst-tanah')
    const energy=[...current.active.energy,...Array.from({length:amount},()=>card)]
    return addLog(
      {...current,active:{...current.active,energy}},
      'good',
      `${t('simLogCongklak')} +${amount}`,
    )
  }

  function deploy(card:Card){
    if(state.phase!=='playing') return
    if(state.active&&state.bench.length>=2){
      setStatus(t('simHintNoSpace'))
      return
    }
    const unit=unitFrom(card)
    const hand=removeFirst(state.hand,card.id)
    if(!state.active){
      setState(addLog({...state,active:unit,hand},'info',`${card.name[locale]} ${t('simLogDeployActive')}`))
    }else{
      setState(addLog({...state,bench:[...state.bench,unit],hand},'info',`${card.name[locale]} ${t('simLogDeployBench')}`))
    }
    setStatus(null)
  }

  function attach(card:Card){
    if(!state.active) return
    if(state.energyUsed){
      setStatus(t('simHintNoEnergy'))
      return
    }
    const hand=removeFirst(state.hand,card.id)
    setState(addLog(
      {
        ...state,
        hand,
        energyUsed:true,
        active:{...state.active,energy:[...state.active.energy,card]},
      },
      'info',
      `${t(card.element??'energy')} ${t('energy')} ${t('simLogAttach')} ${state.active.card.name[locale]}.`,
    ))
    setStatus(null)
  }

  function playPowerup(card:Card){
    if(!state.active) return
    if(state.powerupUsed){
      setStatus(t('simHintNoPower'))
      return
    }
    if(state.active.powerups.length>=2){
      setStatus(t('simHintPowerFull'))
      return
    }
    const synergy=card.element===state.active.card.element
    const ward=card.id==='kst-petak-umpet'?(synergy?2:1):state.active.ward
    const hand=removeFirst(state.hand,card.id)
    const text=`${card.name[locale]} ${t('simLogPowerup')} ${state.active.card.name[locale]}.${synergy?` ${t('simLogSynergy')}`:''}`
    setState(addLog(
      {
        ...state,
        hand,
        powerupUsed:true,
        active:{...state.active,powerups:[...state.active.powerups,card],ward},
      },
      'info',
      text,
    ))
    setStatus(null)
  }

  function playCard(card:Card){
    if(card.type==='character') deploy(card)
    else if(card.type==='energy') attach(card)
    else playPowerup(card)
  }

  function attack(){
    if(state.phase!=='playing'||!state.active) return
    if(state.attacked){
      setStatus(t('simHintAttacked'))
      return
    }
    const cost=state.active.card.attackCost??[]
    const payment=payEnergy(state.active.energy,cost)
    if(!payment){
      setStatus(t('simHintNeedCost'))
      return
    }
    let damage=state.active.card.dmg??0
    if(state.active.card.id==='kst-arka') damage+=10
    const power=state.active.powerups.find(item=>item.id==='kst-gundu')
    if(power){
      damage+=power.element===state.active.card.element?25:10
    }
    let next:SimState={
      ...state,
      active:{...state.active,energy:payment.remaining},
      discard:[...state.discard,...payment.spent],
      attacked:true,
    }
    if(state.active.card.id==='kst-sekar'){
      const index=next.discard.findIndex(card=>card.type==='energy')
      if(index>=0&&next.active){
        const recovered=next.discard[index]
        next={
          ...next,
          discard:next.discard.filter((_,i)=>i!==index),
          active:{...next.active,energy:[...next.active.energy,recovered]},
        }
        next=addLog(next,'info',`${t('simLogEnergyBack')} ${state.active.card.name[locale]}.`)
      }
    }
    next=addLog(next,'hit',`${state.active.card.name[locale]} ${t('simLogAttack')} ${damage} DMG.`)
    pop('rival',damage)
    setState(damageRival(next,damage))
    setStatus(null)
  }

  function endTurn(){
    if(state.phase!=='playing') return
    let next=state
    if(state.rival.hp>0&&state.active){
      const egrang=state.active.powerups.find(item=>item.id==='kst-egrang')
      const egrangSynergy=!!egrang&&egrang.element===state.active.card.element
      const wardUsed=state.active.ward>0
      let dodged=wardUsed
      if(wardUsed){
        next={...next,active:{...state.active,ward:state.active.ward-1}}
        next=addLog(next,'info',t('simLogWard'))
      }else{
        const chance=egrang?(egrangSynergy?0.5:0.25):(state.active.card.id==='kst-laras'?0.25:0)
        dodged=Math.random()<chance
      }
      if(dodged){
        if(!wardUsed&&egrangSynergy){
          pop('rival',10)
          next=addLog(next,'hit',t('simLogCounter'))
          next=damageRival(next,10)
        }else if(!wardUsed){
          next=addLog(next,'info',t('simLogDodge'))
        }
      }else{
        const damage=state.rival.card.dmg??0
        pop('hero',damage)
        next=addLog(next,'hurt',`${state.rival.card.name[locale]} ${t('simLogRivalAttack')} ${damage} DMG.`)
        next=damagePlayer(next,damage)
      }
    }
    if(next.phase==='playing'){
      next=drawOne(next)
      if(next.phase==='playing'){
        next=applyCongklak(next)
        next={...next,turn:next.turn+1,energyUsed:false,powerupUsed:false,attacked:false}
      }
    }
    setState(next)
    setStatus(null)
  }

  function swap(index:number){
    if(state.phase!=='playing') return
    const target=state.bench[index]
    if(!state.active||!target) return
    if(state.active.energy.length===0){
      setStatus(t('simHintSwapNeed'))
      return
    }
    const [cost,...remaining]=state.active.energy
    const oldActive={...state.active,energy:remaining}
    const bench=state.bench.map((unit,i)=>i===index?oldActive:unit)
    setState(addLog(
      {
        ...state,
        active:target,
        bench,
        discard:[...state.discard,cost],
      },
      'info',
      t('simLogSwap'),
    ))
    setStatus(null)
  }

  function reset(){
    setState(makeInitialState())
    setStatus(null)
    setPops([])
    setResultDismissed(false)
  }

  const attackCost=state.active?.card.attackCost??[]
  const payment=state.active?payEnergy(state.active.energy,attackCost):null
  const canAttack=state.phase==='playing'&&!!state.active&&!state.attacked&&!!payment
  const playerHp=state.active?`${state.active.hp}/${state.active.maxHp}`:'0/0'
  const rivalHp=`${state.rival.hp}/${state.rival.maxHp}`

  function getSuggestion():Suggestion{
    if(state.phase==='won') return {kind:'none',text:t('simWin'),cardIndex:null,strike:false,end:false}
    if(state.phase==='lost') return {kind:'none',text:t('simLose'),cardIndex:null,strike:false,end:false}
    const attackNeeded=state.active?.card.attackCost?.find(token=>token!=='any')??null
    const matchingIndex=state.active
      ?state.hand.findIndex(card=>card.type==='energy'&&(!attackNeeded||card.element===attackNeeded))
      :-1
    if(!state.active){
      const characterIndex=state.hand.findIndex(card=>card.type==='character')
      const character=characterIndex>=0?state.hand[characterIndex]:null
      return {
        kind:'deploy',
        text:character?`${character.name[locale]}: ${t('simHintDeploy')}.`:t('simHintNoSpace'),
        cardIndex:characterIndex>=0?characterIndex:null,
        strike:false,
        end:false,
      }
    }
    if(matchingIndex>=0&&!state.energyUsed){
      const suffix=t('simHintAttachSuffix')
      return {
        kind:'attach',
        text:`${t('simHintAttachElement')} ${t(attackNeeded??state.active.card.element??'energy')}${suffix?` ${suffix}`:''} ${t('simHintTo')} ${state.active.card.name[locale]}.`,
        cardIndex:matchingIndex,
        strike:false,
        end:false,
      }
    }
    const powerupIndexes=state.active.powerups.length<2
      ?state.hand.map((card,index)=>({card,index})).filter(entry=>entry.card.type==='power_up')
      :[]
    const synergyEntry=powerupIndexes.find(entry=>entry.card.element===state.active?.card.element)
    const powerupEntry=synergyEntry??powerupIndexes[0]
    if(powerupEntry&&!state.powerupUsed){
      const synergy=powerupEntry.card.element===state.active.card.element
      return {
        kind:'powerup',
        text:fill(t('simHintPowerSuggest'),{name:powerupEntry.card.name[locale]})+ (synergy?` ${t('simLogSynergy')}`:''),
        cardIndex:powerupEntry.index,
        strike:false,
        end:false,
      }
    }
    if(!state.attacked&&canAttack) return {kind:'attack',text:t('simHintAttack'),cardIndex:null,strike:true,end:false}
    if(state.attacked) return {kind:'end',text:t('simHintAttacked'),cardIndex:null,strike:false,end:true}
    if(state.energyUsed) return {kind:'end',text:t('simHintSaveEnergy'),cardIndex:null,strike:false,end:true}
    return {kind:'end',text:t('simHintNoMatchingEnergy'),cardIndex:null,strike:false,end:true}
  }

  const suggestion=getSuggestion()
  const hint=suggestion.text
  const flow:readonly FlowStep[]=[
    {label:t('simStepEnergy'),done:state.energyUsed,current:suggestion.kind==='attach'},
    {label:t('simStepPower'),done:state.powerupUsed,current:suggestion.kind==='powerup',optional:true},
    {label:t('simStepStrike'),done:state.attacked,current:suggestion.kind==='attack'},
    {label:t('simStepEnd'),done:false,current:suggestion.kind==='end'},
  ]
  // The glow always follows the current suggestion, never a separate tutorial step.
  const glowIndex=suggestion.cardIndex
  const strikeGlow=suggestion.kind==='attack'
  const endGlow=suggestion.kind==='end'
  const toGlowClass=(on:boolean)=>on&&!reduce?'animate-sim-glow':''
  const toGlowStyle=(on:boolean)=>on&&reduce?{boxShadow:GLOW_SHADOW}:undefined
  // The coach follows the same suggestion, so its text can never point somewhere else.
  const tourStep=suggestion.kind==='attack'?1:suggestion.kind==='end'?2:0
  const won=state.phase==='won'
  const lost=state.phase==='lost'
  const resultReason=state.log[0]?.text??(won?t('simWin'):t('simLose'))

  function renderBenchSlot(index:number){
    const unit=state.bench[index]
    if(!unit) return (
      <div className="w-[96px] aspect-[5/7.6] border border-dashed border-[rgba(44,45,49,0.85)] rounded-[8px] flex flex-col items-center justify-center gap-[6px] text-[#4f5155] [&_span]:text-[24px] [&_span]:leading-none [&_small]:text-[8px] [&_small]:uppercase [&_small]:tracking-[0.1em] max-[767px]:w-full max-[767px]:min-w-0">
        <span aria-hidden="true">+</span>
        <small>{t('simBench')}</small>
      </div>
    )
    return (
      <div className="w-[96px] flex flex-col gap-[4px] p-[6px] border border-[rgba(44,45,49,0.8)] rounded-[8px] bg-[rgba(20,21,24,0.8)] [&_strong]:text-[10px] [&_strong]:font-semibold [&_strong]:text-[#ece9e2] [&_strong]:leading-[1.35] [&_small]:text-[9px] [&_small]:text-[#85878b] max-[767px]:w-full max-[767px]:min-w-0">
        <div className="aspect-[5/7] rounded-[5px] overflow-hidden bg-[#111215] border border-[rgba(210,175,98,0.16)] grid place-items-center text-[#d2af62] [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:block">
          {unit.card.art?<img src={unit.card.art} alt={unit.card.name[locale]} width={659} height={923}/>:<span>?</span>}
        </div>
        <strong>{unit.card.name[locale]}</strong>
        <small>HP {unit.hp}/{unit.maxHp}</small>
        <button
          type="button"
          className="inline-flex items-center gap-[4px] justify-center py-[4px] px-0 border border-[rgba(210,175,98,0.2)] rounded-[4px] bg-transparent text-[#d2af62] text-[9px] [font-family:inherit] cursor-pointer hover:bg-[rgba(210,175,98,0.1)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
          onClick={()=>swap(index)}
          title={t('simLogSwapNeed')}
        >
          <ArrowLeftRight size={11} aria-hidden="true"/>
          {t('simSwap')}
        </button>
      </div>
    )
  }

  return (
    <section id="coba" className={`w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] py-[82px] px-0 max-[767px]:py-[56px] max-[767px]:px-0${bare?' pt-[34px] max-[767px]:pt-[24px]':''}`} aria-labelledby="sim-title">
      {!bare&&(
        <div className="max-w-[730px] mb-[38px] [&_p]:mt-[18px] [&_p]:max-w-[650px] max-[767px]:mb-[30px] max-[767px]:[&_p]:text-[13px]">
          <h2 id="sim-title" style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:'clamp(25px, 3vw, 37px)',
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            margin:0,
          }}>
            {t('simTitle')}
          </h2>
          <p style={{
            marginTop:18,
            maxWidth:650,
            color:'#b5b2a9',
            fontSize:15,
            lineHeight:1.7,
          }}>
            {t('simCopy')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)_344px] gap-[16px] items-start mt-[30px] max-[1023px]:grid-cols-[1fr]">
        <div className="[grid-column:1/-1] flex items-center gap-y-[10px] gap-x-[14px] flex-wrap py-[11px] px-[14px] border border-[rgba(44,45,49,0.7)] rounded-[10px] bg-[rgba(20,21,24,0.7)] text-[10px] tracking-[0.08em] uppercase text-[#8b8d91] [&_span]:inline-flex [&_span]:items-center [&_span]:gap-[5px] [&_svg]:[flex:none] [&_svg]:text-[#d2af62] [&_svg]:opacity-[.8] [&_[data-used=true]]:text-[#d2af62] max-[1023px]:[grid-column:auto] max-[767px]:grid max-[767px]:grid-cols-[auto_1fr] max-[767px]:text-[9px] max-[767px]:gap-y-[10px] max-[767px]:gap-x-[12px] max-[767px]:py-[10px] max-[767px]:px-[11px] max-[767px]:[&_.lab-hud-nolimit]:hidden max-[339px]:grid-cols-[1fr]">
          <div className="flex items-center flex-wrap gap-y-[10px] gap-x-[14px] min-w-0 max-[767px]:[grid-column:1/-1] max-[767px]:justify-between max-[767px]:gap-y-[6px] max-[767px]:gap-x-[8px]">
            <span className="text-[#ece9e2] font-semibold"><Target size={13} aria-hidden="true"/>{t('simTurn')} {state.turn}</span>
            <span className="text-[#e0a06a] font-semibold">{t('simKO')} {state.ko}/{KO_TO_WIN}</span>
            <span><Layers size={13} aria-hidden="true"/>{t('simDeck')} {state.deck.length}</span>
            <span><RotateCw size={13} aria-hidden="true"/>{t('simDiscard')} {state.discard.length}</span>
          </div>
          <div className="flex items-center flex-wrap gap-y-[10px] gap-x-[14px] ml-auto max-[767px]:[grid-column:1] max-[767px]:ml-0 max-[767px]:flex-nowrap max-[767px]:gap-[8px] max-[339px]:flex-wrap">
            <span data-used={state.energyUsed}><Battery size={13} aria-hidden="true"/><span className="lab-hud-label">{t('energy')}</span> {state.energyUsed?'1':'0'}/1</span>
            <span data-used={state.powerupUsed}><Zap size={13} aria-hidden="true"/><span className="lab-hud-label">{t('power_up')}</span> {state.powerupUsed?'1':'0'}/1</span>
          </div>
          <span className="text-[#b5b2a9] normal-case tracking-[.02em] max-[767px]:[grid-column:2] max-[767px]:justify-self-end max-[767px]:ml-0 max-[767px]:whitespace-nowrap max-[339px]:[grid-column:1] max-[339px]:justify-self-start" title={`${t('simHand')} ${state.hand.length} · ${t('simNoHandLimit')}`}><Hand size={13} aria-hidden="true"/>{t('simHand')} {state.hand.length}<span className="lab-hud-nolimit"> · {t('simNoHandLimit')}</span></span>
        </div>

        <div
          className="[grid-column:1/-1] flex flex-wrap items-center gap-x-[10px] gap-y-[8px] py-[10px] px-[14px] border border-[rgba(44,45,49,0.7)] rounded-[10px] bg-[rgba(20,21,24,0.5)] max-[767px]:py-[9px] max-[767px]:px-[11px]"
          aria-label={t('simFlowTitle')}
        >
          <span className="text-[9px] tracking-[0.16em] uppercase text-[#85878b] font-semibold">{t('simFlowTitle')}</span>
          <ol className="list-none m-0 p-0 flex flex-wrap items-center gap-[6px]">
            {flow.map((step,i)=>(
              <li
                key={step.label}
                aria-current={step.current?'step':undefined}
                data-state={step.current?'current':step.done?'done':'todo'}
                className="inline-flex items-center gap-[6px] py-[4px] px-[9px] rounded-[999px] border transition-colors duration-[.2s] data-[state=current]:border-[rgba(210,175,98,0.65)] data-[state=current]:bg-[rgba(210,175,98,0.12)] data-[state=current]:text-[#e8cd8a] data-[state=done]:border-[rgba(74,184,122,0.35)] data-[state=done]:bg-[rgba(74,184,122,0.06)] data-[state=done]:text-[#9aa79b] data-[state=todo]:border-[rgba(44,45,49,0.9)] data-[state=todo]:text-[#8b8d91]"
              >
                <span
                  data-state={step.current?'current':step.done?'done':'todo'}
                  className="grid place-items-center w-[15px] h-[15px] rounded-full border text-[8px] leading-none data-[state=current]:border-[rgba(210,175,98,0.6)] data-[state=current]:text-[#d2af62] data-[state=done]:border-[rgba(74,184,122,0.4)] data-[state=done]:text-[#7fc08a] data-[state=todo]:border-[rgba(44,45,49,0.9)] data-[state=todo]:text-[#6f7175]"
                >
                  {step.done?<Check size={10} aria-hidden="true"/>:i+1}
                </span>
                <span className="text-[10px] tracking-[0.05em] uppercase font-semibold">{step.label}</span>
                {step.optional&&<span className="text-[8.5px] text-[#6f7175]">({t('simFlowOptional')})</span>}
              </li>
            ))}
          </ol>
        </div>

        <div className="relative border border-[rgba(44,45,49,0.8)] rounded-[14px] overflow-hidden bg-[radial-gradient(90%_80%_at_50%_0%,rgba(210,175,98,0.06),transparent_65%),linear-gradient(180deg,#16171a,#0f1013)]">
          <div className="py-[18px] px-[20px] relative max-[767px]:p-[14px] border-b border-dashed border-b-[rgba(44,45,49,0.55)]">
            <div className="flex items-center justify-between gap-[10px] mb-[12px]">
              <span className="text-[9px] tracking-[0.16em] uppercase text-[#85878b] font-semibold">{t('simRival')}</span>
              <span className="flex gap-[4px] [&_span]:w-[7px] [&_span]:h-[7px] [&_span]:rounded-full [&_span]:border [&_span]:border-[rgba(210,175,98,0.4)] [&_span]:bg-transparent [&_span[data-on=true]]:bg-[#d2af62] [&_span[data-on=true]]:shadow-[0_0_8px_rgba(210,175,98,0.5)]" aria-label={`${t('simKO')} ${state.ko}`}>
                {Array.from({length:KO_TO_WIN},(_,i)=>(
                  <span key={i} data-on={i<state.ko} aria-hidden="true"/>
                ))}
              </span>
            </div>

            <div className="relative flex gap-[18px] items-center justify-center max-[767px]:gap-[12px]">
              <motion.div
                className="relative [flex:none] rounded-[9px] overflow-hidden border border-[rgba(210,175,98,0.3)] bg-[#111215] shadow-[0_10px_24px_rgba(0,0,0,0.45)] [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-cover w-[118px] aspect-[5/7] [transform:rotate(-1.2deg)] max-[767px]:w-[96px]"
                animate={reduce?undefined:{x:state.rival.hp<state.rival.maxHp?[0,-5,5,-3,0]:0}}
                transition={{duration:.35}}
              >
                {state.rival.card.art?(
                  <img src={state.rival.card.art} alt={state.rival.card.name[locale]} width={659} height={923}/>
                ):(
                  <span className="grid place-items-center w-full h-full font-heading text-[42px] text-[#d2af62] opacity-[.6]">?</span>
                )}
              </motion.div>
              <div className="flex flex-col gap-[5px] min-w-0 [flex:0_1_260px] [&_strong]:font-heading [&_strong]:text-[14px] [&_strong]:text-[#ece9e2] [&_strong]:leading-[1.35] [&_small]:text-[10px] [&_small]:text-[#85878b] [&_small]:uppercase [&_small]:tracking-[.08em]">
                <strong>{state.rival.card.name[locale]}</strong>
                <small>{t('character')} · DMG {state.rival.card.dmg??0}</small>
                <div className="relative h-[18px] w-full max-w-[230px] rounded-[999px] bg-[rgba(23,24,27,0.9)] border border-[rgba(44,45,49,0.8)] overflow-hidden mt-[4px]" role="img" aria-label={rivalHp}>
                  <motion.span
                    className="absolute top-0 bottom-0 left-0 bg-[linear-gradient(90deg,#8a4a3c,#b3644f)]"
                    animate={{width:`${(state.rival.hp/state.rival.maxHp)*100}%`}}
                    transition={{duration:.45,ease:'easeOut'}}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-heading text-[10px] text-[#ece9e2]">{rivalHp}</span>
                </div>
              </div>

              <AnimatePresence>
                {pops.filter(item=>item.target==='rival').map(item=>(
                  <motion.span
                    key={item.id}
                    className="absolute font-heading text-[18px] font-semibold pointer-events-none z-[3] left-[82px] top-[8px] text-[#e0a06a] [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]"
                    initial={{opacity:0,y:8,scale:.8}}
                    animate={{opacity:1,y:-24,scale:1}}
                    exit={{opacity:0,y:-38}}
                    transition={{duration:.5,ease:'easeOut'}}
                  >
                    -{item.value}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center font-heading text-[10px] tracking-[0.26em] text-[#6f7175] py-[4px] px-0 border-t border-dashed border-[rgba(44,45,49,0.5)] border-b bg-[rgba(11,12,14,0.4)]" aria-hidden="true">VS</div>

          <div className="py-[18px] px-[20px] relative max-[767px]:p-[14px] bg-[rgba(210,175,98,0.02)]" data-board-side="player">
            <div className="flex items-center justify-between gap-[10px] mb-[12px]">
              <span className="text-[9px] tracking-[0.16em] uppercase text-[#85878b] font-semibold">{t('simYou')}</span>
              <span className="text-[9px] tracking-[0.1em] uppercase text-[#6f7175]">{t('simBench')} {state.bench.length}/2</span>
            </div>

            <div className="flex items-start justify-center gap-[18px] flex-nowrap max-[767px]:gap-[8px]">
              <div className="flex gap-[10px] items-end [flex:0_1_auto] min-w-0 pt-[20px] max-[767px]:[flex:1_1_78px] max-[767px]:max-w-[86px]" aria-label={`${t('simBench')} 1`}>
                {renderBenchSlot(0)}
              </div>

              <div className="relative flex flex-col gap-[6px] items-start max-[767px]:[flex:1_1_120px] max-[767px]:min-w-[88px] max-[767px]:max-w-[126px]">
                <span className="text-[9px] tracking-[0.16em] uppercase text-[#85878b] font-semibold mb-[2px]">{t('simActive')}</span>
                {state.active?(
                  <>
                    <motion.div
                      className="relative [flex:none] rounded-[9px] overflow-hidden border border-[rgba(210,175,98,0.3)] bg-[#111215] shadow-[0_10px_24px_rgba(0,0,0,0.45)] [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-cover w-[148px] aspect-[5/7] max-[767px]:w-full"
                      animate={reduce?undefined:{y:state.attacked?0:[0,-3,0]}}
                      transition={{duration:3,repeat:state.attacked?0:Infinity,ease:'easeInOut'}}
                    >
                      {state.active.card.art?(
                        <img src={state.active.card.art} alt={state.active.card.name[locale]} width={659} height={923}/>
                      ):(
                        <span className="grid place-items-center w-full h-full font-heading text-[42px] text-[#d2af62] opacity-[.6]">?</span>
                      )}
                    </motion.div>
                    <div className="flex flex-col gap-[5px] max-w-[150px] [&_strong]:font-heading [&_strong]:text-[11px] [&_strong]:text-[#ece9e2] [&_strong]:leading-[1.3] max-[767px]:max-w-full">
                      <strong>{state.active.card.name[locale]}</strong>
                      <div className="flex gap-[4px] flex-wrap min-h-[28px] items-center">
                        {state.active.energy.length===0&&<span className="text-[9px] text-[#6f7175] uppercase tracking-[0.08em]">0 Energy</span>}
                        {state.active.energy.map((energy,i)=>(
                          <span key={`${energy.id}-${i}`} className="w-[20px] h-[28px] rounded-[3px] overflow-hidden border border-[rgba(210,175,98,0.3)] grid place-items-center text-[8px] text-[#d2af62] bg-[#15161a] [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:block" title={t(energy.element??'energy')}>
                            {energy.art?<img src={energy.art} alt="" width={659} height={923}/>:t(energy.element??'energy')}
                          </span>
                        ))}
                      </div>
                      {state.active.powerups.map(powerup=>(
                        <span key={powerup.id} className="inline-flex items-center gap-[5px] max-w-full [padding:3px_7px_3px_3px] rounded-[999px] border border-[rgba(210,175,98,0.3)] bg-[rgba(210,175,98,0.08)] text-[9px] text-[#d8c08a] overflow-hidden whitespace-nowrap [text-overflow:ellipsis] [&_img]:w-[16px] [&_img]:h-[22px] [&_img]:object-cover [&_img]:rounded-[2px]">
                          {powerup.art&&<img src={powerup.art} alt="" width={659} height={923}/>}
                          {powerup.name[locale]}
                        </span>
                      ))}
                    </div>
                    <div className="relative h-[18px] w-full max-w-[230px] rounded-[999px] bg-[rgba(23,24,27,0.9)] border border-[rgba(44,45,49,0.8)] overflow-hidden mt-[4px]" role="img" aria-label={playerHp}>
                      <motion.span
                        className="absolute top-0 bottom-0 left-0 bg-[linear-gradient(90deg,#7a6534,#d2af62)]"
                        animate={{width:`${(state.active.hp/state.active.maxHp)*100}%`}}
                        transition={{duration:.45,ease:'easeOut'}}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-heading text-[10px] text-[#ece9e2]">{playerHp}</span>
                    </div>
                  </>
                ):(
                  <div className="w-[148px] aspect-[5/7] grid place-items-center border border-dashed border-[rgba(44,45,49,0.8)] rounded-[9px] text-[10px] text-[#6f7175] text-center p-[10px] max-[767px]:w-full">{t('simHintNoSpace')}</div>
                )}

                <AnimatePresence>
                  {pops.filter(item=>item.target==='hero').map(item=>(
                    <motion.span
                      key={item.id}
                      className="absolute font-heading text-[18px] font-semibold pointer-events-none z-[3] right-[-6px] top-[30px] text-[#e08070] [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]"
                      initial={{opacity:0,y:8,scale:.8}}
                      animate={{opacity:1,y:-24,scale:1}}
                      exit={{opacity:0,y:-38}}
                      transition={{duration:.5,ease:'easeOut'}}
                    >
                      -{item.value}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-[10px] items-end [flex:0_1_auto] min-w-0 pt-[20px] max-[767px]:[flex:1_1_78px] max-[767px]:max-w-[86px]" aria-label={`${t('simBench')} 2`}>
                {renderBenchSlot(1)}
              </div>
            </div>
          </div>

          {(won||lost)&&!resultDismissed&&(
            <SimResultBanner
              won={won}
              reason={resultReason}
              turn={state.turn}
              ko={state.ko}
              koToWin={KO_TO_WIN}
              onPlayAgain={playAgain}
              onViewBoard={()=>setResultDismissed(true)}
            />
          )}
        </div>

        <div className="flex flex-col gap-[12px] p-[16px] border border-[rgba(44,45,49,0.7)] rounded-[12px] bg-[rgba(20,21,24,0.6)] max-[339px]:p-[13px]">
          {tourOpen&&(
            <div className="flex flex-col gap-[8px] p-[13px_14px] rounded-[10px] border border-[rgba(210,175,98,0.5)] bg-[rgba(210,175,98,0.08)]" aria-label={t('simTourBadge')}>
              <div className="flex items-center justify-between gap-[8px]">
                <span className="inline-flex items-center gap-[6px] text-[9px] tracking-[0.14em] uppercase font-semibold text-[#d2af62]">
                  <Compass size={13} aria-hidden="true"/>
                  {t('simTourBadge')} · {t('simTourStep')} {tourStep+1}/3
                </span>
                <span className="flex gap-[4px]" aria-hidden="true">
                  {[0,1,2].map(dot=>(
                    <span key={dot} data-on={dot<=tourStep} className="inline-block w-[5px] h-[5px] rounded-full bg-[rgba(210,175,98,0.25)] data-[on=true]:bg-[#d2af62]"/>
                  ))}
                </span>
              </div>
              <p className="m-0 text-[12.5px] leading-[1.6] text-[#d8d5cd]">{t(tourStep===0?'simTour1':tourStep===1?'simTour2':'simTour3')}</p>
              <div className="flex items-center justify-between gap-[8px]">
                <button
                  type="button"
                  className="text-[10.5px] text-[#8b8d91] bg-transparent border-0 p-0 cursor-pointer hover:text-[#ece9e2] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
                  onClick={skipTour}
                >
                  {t('simTourSkip')}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-[5px] py-[7px] px-[14px] rounded-[6px] border border-[rgba(210,175,98,0.55)] bg-[rgba(210,175,98,0.16)] text-[#e8cd8a] text-[11px] font-semibold cursor-pointer hover:bg-[rgba(210,175,98,0.26)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
                  onClick={dismissTour}
                >
                  {t('simTourDone')}
                </button>
              </div>
            </div>
          )}
          {status&&(
            <div className="flex items-center gap-[8px] py-[9px] px-[12px] rounded-[7px] border border-[rgba(232,122,102,0.35)] bg-[rgba(232,122,102,0.1)] text-[12px] leading-[1.55] text-[#f0b6a4] [&_svg]:[flex:none]" role="alert">
              <AlertTriangle size={14} aria-hidden="true"/>
              <span>{status}</span>
            </div>
          )}
          <div className="flex items-center gap-[8px] py-[10px] px-[12px] rounded-[7px] border border-[rgba(210,175,98,0.13)] bg-[rgba(210,175,98,0.05)] text-[12px] leading-[1.55] text-[#d8d5cd] [&_svg]:[flex:none] [&_svg]:text-[#d2af62]" role="status" aria-live="polite">
            <Sparkles size={14} aria-hidden="true"/>
            <span>{hint}</span>
          </div>

          <div
            className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[8px] max-[339px]:grid-cols-[repeat(3,minmax(0,1fr))]"
            aria-label={t('simHand')}
          >
            {state.hand.length===0&&<span className="text-[11px] text-[#85878b] py-[18px] px-0 [grid-column:1/-1]">{t('simHandEmpty')}</span>}
            <AnimatePresence initial={false}>
              {state.hand.map((card,index)=>{
                const locked=
                  state.phase!=='playing'||
                  (card.type==='character'?!!state.active&&state.bench.length>=2:!state.active)||
                  (card.type==='energy'&&state.energyUsed)||
                  (card.type==='power_up'&&(state.powerupUsed||(state.active?.powerups.length??0)>=2))
                const meta=card.type==='character'
                  ?t('character')
                  :`${t(card.element??'energy')} · ${t(card.type)}`
                const highlight=!locked&&index===glowIndex
                return (
                  <motion.button
                    key={`${card.id}-${index}`}
                    layout
                    type="button"
                    className={`flex flex-col gap-[4px] p-[6px] rounded-[8px] border border-[rgba(44,45,49,0.85)] bg-[linear-gradient(180deg,#191a1d,#131417)] text-[#ece9e2] text-left cursor-pointer transition-[transform,border-color,opacity] duration-[.18s] hover:[transform:translateY(-3px)] hover:border-[rgba(210,175,98,0.45)] data-[locked=true]:opacity-[.5] data-[locked=true]:border-[rgba(44,45,49,0.6)] data-[locked=true]:hover:[transform:none] data-[locked=true]:hover:border-[rgba(44,45,49,0.6)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px] ${toGlowClass(highlight)}`}
                    data-type={card.type}
                    data-locked={locked||undefined}
                    data-hint={highlight?'true':undefined}
                    onClick={()=>playCard(card)}
                    initial={{opacity:0,y:8}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,scale:.9}}
                    transition={{duration:.2}}
                    style={toGlowStyle(highlight)}
                    aria-label={`${card.name[locale]}, ${meta}`}
                  >
                    <span className="aspect-[5/7] rounded-[5px] overflow-hidden bg-[#111215] border border-[rgba(44,45,49,0.7)] grid place-items-center [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:block [&_span]:font-heading [&_span]:text-[34px] [&_span]:text-[#d2af62] [&_span]:opacity-[.6]">
                      {card.art?<img src={card.art} alt="" width={659} height={923}/>:<span aria-hidden="true">?</span>}
                    </span>
                    <span className="font-heading text-[9px] leading-[1.35] text-[#ece9e2] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">{card.name[locale]}</span>
                    <span className="text-[8px] tracking-[0.06em] uppercase text-[#85878b]">{meta}</span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-[6px] text-[9px] tracking-[0.06em] uppercase text-[#85878b] [&_svg]:text-[#d2af62] [&_svg]:opacity-[.8]">
            <Battery size={13} aria-hidden="true"/>
            <span>{t('simLimitEnergy')}</span>
            <span className="w-[1px] h-[10px] bg-[rgba(44,45,49,0.9)] my-0 mx-[4px]" aria-hidden="true"/>
            <Zap size={13} aria-hidden="true"/>
            <span>{t('simLimitPowerup')}</span>
          </div>

          <div className="flex gap-[8px] flex-wrap max-[339px]:gap-[6px]">
            <button
              type="button"
              className={`inline-flex items-center gap-[7px] [flex:1] justify-center min-h-[44px] py-0 px-[16px] rounded-[8px] border border-[rgba(210,175,98,0.45)] bg-[rgba(210,175,98,0.13)] text-[#e8cd8a] text-[12px] font-semibold font-heading cursor-pointer hover:[&:not(:disabled)]:bg-[rgba(210,175,98,0.22)] disabled:opacity-[.45] disabled:cursor-not-allowed disabled:[filter:saturate(.35)] disabled:bg-[rgba(210,175,98,0.05)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px] max-[339px]:[flex:1_1_100%] ${toGlowClass(strikeGlow)}`}
              onClick={attack}
              disabled={!canAttack}
              data-hint={strikeGlow?'true':undefined}
              style={toGlowStyle(strikeGlow)}
            >
              <Swords size={16} aria-hidden="true"/>
              {t('simStrike')}
              <span className="inline-flex gap-[3px] items-center">
                {attackCost.length===0&&<span className="text-[9px] text-[#b5b2a9] py-[1px] px-[5px] border border-[rgba(139,141,145,0.5)] rounded-[3px]">0</span>}
                {attackCost.map((token,i)=>(
                  <span
                    key={i}
                    className="text-[8px] py-[1px] px-[5px] rounded-[3px] [border:1px_solid] text-[#d8d5cd] uppercase tracking-[0.04em] data-[element=api]:bg-[rgba(224,100,63,0.12)] data-[element=api]:text-[#e8a087] data-[element=air]:bg-[rgba(91,159,212,0.12)] data-[element=air]:text-[#9cc4e4] data-[element=tanah]:bg-[rgba(176,138,90,0.12)] data-[element=tanah]:text-[#d3b68f]"
                    data-element={token}
                    style={{borderColor:token==='any'?'#8b8d91':ELEMENT_HEX[token]}}
                  >
                    {token==='any'?'◇':t(token)}
                  </span>
                ))}
              </span>
            </button>
            <button type="button" className={`inline-flex items-center gap-[6px] min-h-[44px] py-0 px-[14px] rounded-[8px] border border-[rgba(44,45,49,0.9)] bg-transparent text-[#b5b2a9] text-[11px] cursor-pointer hover:[&:not(:disabled)]:border-[rgba(210,175,98,0.35)] hover:[&:not(:disabled)]:text-[#ece9e2] disabled:opacity-[.45] disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px] ${toGlowClass(endGlow)}`} onClick={endTurn} disabled={state.phase!=='playing'} data-hint={endGlow?'true':undefined} style={toGlowStyle(endGlow)}>
              <Hand size={15} aria-hidden="true"/>
              {t('simEndTurn')}
            </button>
            <button type="button" className="inline-flex items-center gap-[5px] min-h-[44px] py-0 px-[12px] rounded-[8px] border border-[rgba(44,45,49,0.9)] bg-transparent text-[#8b8d91] text-[11px] cursor-pointer hover:border-[rgba(210,175,98,0.35)] hover:text-[#ece9e2] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]" onClick={reset}>
              <RotateCw size={14} aria-hidden="true"/>
              {t('simReset')}
            </button>
          </div>

          <ul className="list-none m-0 p-0 flex flex-col gap-[5px] min-h-[70px] [&_li]:text-[10.5px] [&_li]:leading-[1.55] [&_li]:text-[#8b8d91] [&_li]:pl-[10px] [&_li]:border-l-[2px] [&_li]:border-[rgba(44,45,49,0.9)] [&_li[data-kind=hit]]:text-[#c9a05a] [&_li[data-kind=hit]]:[border-left-color:rgba(210,175,98,0.5)] [&_li[data-kind=hurt]]:text-[#b3735f] [&_li[data-kind=hurt]]:[border-left-color:rgba(138,74,60,0.6)] [&_li[data-kind=good]]:text-[#7fc08a] [&_li[data-kind=good]]:[border-left-color:rgba(74,184,122,0.5)]">
            <AnimatePresence initial={false}>
              {state.log.map(line=>(
                <motion.li
                  key={line.id}
                  data-kind={line.kind}
                  initial={{opacity:0,x:-8}}
                  animate={{opacity:1,x:0}}
                  exit={{opacity:0}}
                  transition={{duration:.22}}
                >
                  {line.text}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <p className="text-[9.5px] leading-[1.6] text-[#6f7175] m-0">{t('simFoot')}</p>
        </div>
      </div>

    </section>
  )
}
