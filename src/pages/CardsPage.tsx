import {motion,AnimatePresence} from 'framer-motion'
import {Layers3,Search,X} from 'lucide-react'
import {type CardQuery,defaultCardQuery,queryCards} from '@/domain/cards'
import {publishedCards,sourceGameOptions} from '@/data/cards'
import {useMemo,useState} from 'react'
import {useCopy} from '@/i18n/use-copy'
import {useUiStore} from '@/stores/ui-store'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select'
import {CardDialog} from '@/components/CardDialog'
import {CardTile} from '@/components/CardParts'
import {useDebouncedValue} from '@/lib/use-debounced-value'

export function CardsPage(){
  const {locale,t}=useCopy()
  const [query,setQuery]=useState<CardQuery>(defaultCardQuery)
  const [searchDraft,setSearchDraft]=useState('')
  const selectedId=useUiStore(s=>s.selectedCardId)
  const select=useUiStore(s=>s.selectCard)

  const debouncedSearch=useDebouncedValue(searchDraft,250)

  const effective:CardQuery=useMemo(()=>({...query,search:debouncedSearch}),[query,debouncedSearch])
  const visible=useMemo(()=>queryCards(publishedCards,effective,locale),[effective,locale])
  const selected=publishedCards.find(c=>c.id===selectedId)

  const isFiltered=debouncedSearch!==''||query.rarity!=='all'||query.type!=='all'||query.sourceGame!=='all'

  return (
    <motion.div
      style={{
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
      }}
      initial={{opacity:0,y:16}}
      animate={{opacity:1,y:0}}
      transition={{duration:.5,ease:'easeOut'}}
    >
      <section className="pt-[52px] px-0 pb-0">
        <h1 style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:'clamp(28px, 3.6vw, 42px)',
          fontWeight:500,
          lineHeight:1.28,
          letterSpacing:'-.045em',
          color:'#ece9e2',
          margin:0,
        }}>
          {t('cardsPageTitle')}
        </h1>
        <p style={{
          marginTop:16,
          maxWidth:600,
          color:'#b5b2a9',
          fontSize:15,
          lineHeight:1.75,
        }}>
          {t('cardsPageCopy')}
        </p>

        {/* Sticky filter bar */}
        <div className="sticky top-[80px] z-[10] flex items-center gap-[14px] flex-wrap mt-[28px] py-[12px] px-[14px] bg-[rgba(17,18,20,0.94)] backdrop-blur-[10px] border border-[rgba(44,45,49,0.7)] rounded-[10px]">
          <div className="flex items-center gap-[9px] [flex:1] min-w-[220px] h-[38px] py-0 px-[12px] bg-[#17181b] border border-[rgba(44,45,49,0.7)] rounded-[8px] [&_input]:shadow-none">
            <Search aria-hidden="true" size={15} style={{color:'#8b8d91'}}/>
            <Input
              id="cards-page-search"
              value={searchDraft}
              onChange={e=>setSearchDraft(e.target.value)}
              placeholder={t('searchPlaceholder')}
              maxLength={100}
              style={{
                background:'transparent',
                border:'none',
                boxShadow:'none',
                padding:0,
                fontSize:13,
                color:'#ece9e2',
                height:'auto',
                flex:1,
              }}
            />
            {searchDraft!==''&&(
              <button
                type="button"
                aria-label={t('clearSearch')}
                onClick={()=>setSearchDraft('')}
                style={{
                  background:'none',
                  border:'none',
                  color:'#8b8d91',
                  cursor:'pointer',
                  display:'flex',
                  padding:2,
                }}
              >
                <X size={14}/>
              </button>
            )}
          </div>

          <div className="flex gap-[8px] flex-wrap">
            <Select value={query.rarity} onValueChange={v=>setQuery(q=>({...q,rarity:v}))}>
              <SelectTrigger aria-label={t('rarity')} className="h-[38px]! py-0 px-[11px] bg-[#17181b]! border border-[rgba(44,45,49,0.7)] rounded-[8px] [font-size:12px]! text-[#ece9e2]">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="common">{t('common')}</SelectItem>
                <SelectItem value="uncommon">{t('uncommon')}</SelectItem>
                <SelectItem value="rare">{t('rare')}</SelectItem>
                <SelectItem value="epic">{t('epic')}</SelectItem>
                <SelectItem value="secret">{t('secret')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={query.type} onValueChange={v=>setQuery(q=>({...q,type:v}))}>
              <SelectTrigger aria-label={t('type')} className="h-[38px]! py-0 px-[11px] bg-[#17181b]! border border-[rgba(44,45,49,0.7)] rounded-[8px] [font-size:12px]! text-[#ece9e2]">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="energy">{t('energy')}</SelectItem>
                <SelectItem value="character">{t('character')}</SelectItem>
                <SelectItem value="power_up">{t('power_up')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={query.sourceGame} onValueChange={v=>setQuery(q=>({...q,sourceGame:v}))}>
              <SelectTrigger aria-label={t('source')} className="h-[38px]! py-0 px-[11px] bg-[#17181b]! border border-[rgba(44,45,49,0.7)] rounded-[8px] [font-size:12px]! text-[#ece9e2]">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {sourceGameOptions.map(game=>(
                  <SelectItem key={game} value={game}>{game}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={query.sort}
              onValueChange={v=>{
                if(v==='name'||v==='rarity'||v==='setCode')
                  setQuery(q=>({...q,sort:v}))
              }}
            >
              <SelectTrigger aria-label={t('sort')} className="h-[38px]! py-0 px-[11px] bg-[#17181b]! border border-[rgba(44,45,49,0.7)] rounded-[8px] [font-size:12px]! text-[#ece9e2]">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t('name')}</SelectItem>
                <SelectItem value="rarity">{t('rarity')}</SelectItem>
                <SelectItem value="setCode">{t('setCode')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-[14px] px-0 pb-[4px] text-[11px] text-[#85878b]">
          <span role="status" aria-live="polite">
            {visible.length} {t('result')}
          </span>
          {isFiltered&&(
            <Button
              variant="ghost"
              onClick={()=>{
                setQuery(defaultCardQuery)
                setSearchDraft('')
              }}
            >
              {t('reset')}
            </Button>
          )}
        </div>
      </section>

      <AnimatePresence mode="popLayout">
        {visible.length===0?(
          <motion.div
            key="empty"
            className="mt-[12px] py-[64px] px-[20px] text-center border border-[rgba(44,45,49,0.55)] rounded-[12px] [&_h2]:font-heading [&_h2]:text-[17px] [&_h2]:font-medium [&_h2]:text-[#ece9e2] [&_h2]:mt-[14px] [&_h2]:mx-0 [&_h2]:mb-0 [&_p]:text-[12px] [&_p]:text-[#8b8d91] [&_p]:mt-[9px] [&_p]:mx-0 [&_p]:mb-0"
            initial={{opacity:0,y:8}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-8}}
            transition={{duration:.24}}
          >
            <Layers3 size={44} strokeWidth={1} style={{color:'#d2af62',opacity:.5}}/>
            <h2>{t(isFiltered?'noMatch':'emptyTitle')}</h2>
            <p>{t(isFiltered?'noMatchCopy':'emptyCopy')}</p>
          </motion.div>
        ):(
          <motion.div
            key="grid"
            className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[16px] mt-[12px]"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:.22}}
          >
            {visible.map((card,i)=>(
              <CardTile key={card.id} card={card} index={i} onSelect={select}/>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-[44px] mx-0 mb-0 pt-[20px] border-t border-[rgba(38,39,43,0.6)] text-[10px] text-[#8f8f95]">{t('cardsPageFoot')}</p>

      <CardDialog card={selected} onClose={()=>select(null)}/>
    </motion.div>
  )
}
