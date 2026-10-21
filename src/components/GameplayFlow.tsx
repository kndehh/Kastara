import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion,AnimatePresence,useReducedMotion} from 'framer-motion'
import {Hand,Users,BatteryCharging,Zap,Swords,ScrollText,Target,Coins,Sparkle,RotateCw} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'
import type {Dictionary} from '@/i18n'

const steps:ReadonlyArray<{
  icon:typeof Hand
  titleKey:keyof Dictionary
  copyKey:keyof Dictionary
}>=[
  {icon:Hand,titleKey:'flowStep1',copyKey:'flowStep1Copy'},
  {icon:Users,titleKey:'flowStep2',copyKey:'flowStep2Copy'},
  {icon:BatteryCharging,titleKey:'flowStep3',copyKey:'flowStep3Copy'},
  {icon:Zap,titleKey:'flowStep4',copyKey:'flowStep4Copy'},
  {icon:Swords,titleKey:'flowStep5',copyKey:'flowStep5Copy'},
]

const rules:ReadonlyArray<{
  icon:typeof Target
  titleKey:keyof Dictionary
  copyKey:keyof Dictionary
}>=[
  {icon:Target,titleKey:'ruleGoalTitle',copyKey:'ruleGoalCopy'},
  {icon:Coins,titleKey:'ruleDeckTitle',copyKey:'ruleDeckCopy'},
  {icon:RotateCw,titleKey:'ruleSetupTitle',copyKey:'ruleSetupCopy'},
  {icon:Hand,titleKey:'ruleDrawTitle',copyKey:'ruleDrawCopy'},
  {icon:Users,titleKey:'ruleBenchTitle',copyKey:'ruleBenchCopy'},
  {icon:BatteryCharging,titleKey:'ruleEnergyTitle',copyKey:'ruleEnergyCopy'},
  {icon:Zap,titleKey:'rulePowerupTitle',copyKey:'rulePowerupCopy'},
  {icon:Sparkle,titleKey:'ruleSynergyTitle',copyKey:'ruleSynergyCopy'},
]

type Tab='howto'|'rules'

export function GameplayFlow(){
  const {t}=useCopy()
  const reduce=useReducedMotion()
  const [tab,setTab]=useState<Tab>('howto')

  const tabs:ReadonlyArray<{id:Tab;label:keyof Dictionary;icon:typeof Hand}>=[
    {id:'howto',label:'flowTabHow',icon:Swords},
    {id:'rules',label:'flowTabRules',icon:ScrollText},
  ]

  return (
    <section id="alur" className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] py-[92px] px-0 border-b border-[#26272b] max-[767px]:py-[62px] max-[767px]:px-0" aria-labelledby="flow-title">
      <div className="max-w-[730px] mb-[38px] [&_p]:mt-[18px] [&_p]:max-w-[650px] max-[767px]:mb-[30px] max-[767px]:[&_p]:text-[13px]">
        <h2 id="flow-title" style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:'clamp(25px, 3vw, 37px)',
          fontWeight:500,
          lineHeight:1.3,
          letterSpacing:'-.045em',
          textWrap:'balance',
          color:'#ece9e2',
          margin:0,
        }}>
          {t('flowTitle')}
        </h2>
        <p style={{
          marginTop:18,
          maxWidth:650,
          color:'#b5b2a9',
          fontSize:15,
          lineHeight:1.7,
        }}>
          {t('flowCopy')}
        </p>
      </div>

      <div className="flex gap-[6px] mt-[32px] p-[4px] bg-[rgba(23,24,27,0.6)] border border-[rgba(44,45,49,0.6)] rounded-[9px] w-fit max-w-full flex-wrap" role="tablist" aria-label={t('flowTitle')}>
        {tabs.map(tb=>{
          const Icon=tb.icon
          const active=tab===tb.id
          return (
            <button
              key={tb.id}
              type="button"
              role="tab"
              id={`flow-tab-${tb.id}`}
              aria-selected={active}
              aria-controls={`flow-panel-${tb.id}`}
              className="relative inline-flex items-center gap-[7px] py-[9px] px-[17px] border-0 bg-transparent text-[#8b8d91] font-heading text-[12px] font-medium tracking-[-0.01em] rounded-[6px] cursor-pointer transition-[color,background-color] duration-[.22s] hover:text-[#d8d5cd] data-[active=true]:text-[#e8cd8a] data-[active=true]:bg-[rgba(210,175,98,0.09)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
              data-active={active}
              onClick={()=>setTab(tb.id)}
            >
              <Icon aria-hidden="true" size={15} strokeWidth={1.6}/>
              {t(tb.label)}
              {active&&(
                <motion.span
                  className="absolute left-[14px] right-[14px] bottom-[-5px] h-[2px] rounded-[2px] bg-[#d2af62]"
                  layoutId={reduce?undefined:'flow-tab-underline'}
                  transition={{duration:.28,ease:[0.16,1,0.3,1]}}
                />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          id={`flow-panel-${tab}`}
          aria-labelledby={`flow-tab-${tab}`}
          initial={reduce?undefined:{opacity:0,y:10}}
          animate={{opacity:1,y:0}}
          exit={reduce?undefined:{opacity:0,y:-6}}
          transition={{duration:.26,ease:'easeOut'}}
        >
          {tab==='howto'?(
            <>
              <ol className="grid grid-cols-[repeat(5,1fr)] gap-[14px] mt-[44px] relative max-[767px]:grid-cols-[1fr_1fr] max-[767px]:gap-[12px] max-[767px]:mt-[30px] max-[767px]:[&>li:last-child]:[grid-column:1/-1]">
                {steps.map((step,i)=>{
                  const Icon=step.icon
                  return (
                    <motion.li
                      key={step.titleKey}
                      className="relative flex flex-col gap-[12px] pt-[20px] px-[18px] pb-[22px] bg-[linear-gradient(180deg,#17181b_0%,#121315_100%)] border border-[rgba(44,45,49,0.7)] rounded-[10px] hover:border-[rgba(210,175,98,0.3)] [&_h3]:font-heading [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:tracking-[-.02em] [&_h3]:text-[var(--foreground)] [&_h3]:m-0 [&_h3]:leading-[1.35] [&_p]:text-[12px] [&_p]:leading-[1.7] [&_p]:text-[var(--muted-foreground)] [&_p]:m-0 [&_svg]:text-[var(--primary)] [&_svg]:opacity-[.75] max-[767px]:pt-[18px] max-[767px]:px-[16px] max-[767px]:pb-[20px]"
                      initial={{opacity:0,y:18}}
                      animate={{opacity:1,y:0}}
                      transition={{duration:.4,delay:i*.07}}
                    >
                      <span className="font-heading text-[11px] tracking-[.14em] text-[var(--primary)]">{String(i+1).padStart(2,'0')}</span>
                      <Icon aria-hidden="true" size={22} strokeWidth={1.4}/>
                      <h3>{t(step.titleKey)}</h3>
                      <p>{t(step.copyKey)}</p>
                    </motion.li>
                  )
                })}
              </ol>
              <p className="text-[11px] tracking-[.06em] uppercase text-[#85878b]" style={{marginTop:26}}>{t('deckNote')}</p>
            </>
          ):(
            <ol className="grid grid-cols-[repeat(5,1fr)] gap-[14px] mt-[44px] relative max-[767px]:grid-cols-[1fr_1fr] max-[767px]:gap-[12px] max-[767px]:mt-[30px]">
              {rules.map((rule,i)=>{
                const Icon=rule.icon
                return (
                  <motion.li
                    key={rule.titleKey}
                    className="relative flex flex-col gap-[12px] pt-[20px] px-[18px] pb-[22px] bg-[linear-gradient(180deg,#17181b_0%,#121315_100%)] border border-[rgba(44,45,49,0.7)] rounded-[10px] hover:border-[rgba(210,175,98,0.3)] [&_h3]:font-heading [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:tracking-[-.02em] [&_h3]:text-[var(--foreground)] [&_h3]:m-0 [&_h3]:leading-[1.35] [&_p]:text-[12px] [&_p]:leading-[1.7] [&_p]:text-[var(--muted-foreground)] [&_p]:m-0 [&_svg]:text-[var(--primary)] [&_svg]:opacity-[.75] max-[767px]:pt-[18px] max-[767px]:px-[16px] max-[767px]:pb-[20px] [&_svg]:mb-[12px]"
                    initial={{opacity:0,y:18}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:.4,delay:i*.08}}
                  >
                    <Icon aria-hidden="true" size={22} strokeWidth={1.4}/>
                    <h3>{t(rule.titleKey)}</h3>
                    <p>{t(rule.copyKey)}</p>
                  </motion.li>
                )
              })}
            </ol>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-[26px] text-[12px] text-[#85878b] [&_a]:text-[#d2af62] [&_a]:no-underline [&_a]:border-b [&_a]:border-[rgba(210,175,98,0.35)] [&_a]:pb-[1px] [&_a]:transition-[border-color,color] [&_a]:duration-[.2s] [&_a:hover]:text-[#e8cd8a] [&_a:hover]:[border-bottom-color:#d2af62]">
        {t('flowSimPrompt')}{' '}
        <Link to="/experiment">{t('flowSimLink')}</Link>
      </p>
    </section>
  )
}
