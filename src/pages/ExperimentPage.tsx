import {motion} from 'framer-motion'
import {Link,useSearchParams} from 'react-router-dom'
import {ArrowLeft,FlaskConical,ChevronRight} from 'lucide-react'
import {TurnSimulator} from '@/components/TurnSimulator'
import {MapGuide} from '@/components/MapGuide'
import {useCopy} from '@/i18n/use-copy'
import {Button} from '@/components/ui/button'

export function ExperimentPage(){
  const {t}=useCopy()
  const [params,setParams]=useSearchParams()
  const step=params.get('step')==='2'?2:1
  const next=()=>setParams({step:'2'})
  const backMap=()=>{setParams(new URLSearchParams())}

  return (
    <motion.div
      className="px-[20px] max-[1023px]:px-[20px] min-[1024px]:px-[48px] max-w-[1216px] mx-auto w-full"
      initial={{opacity:0,y:16}}
      animate={{opacity:1,y:0}}
      transition={{duration:.5,ease:'easeOut'}}
    >
      <section style={{padding:'56px 0 8px'}}>
        <Link
          to="/"
          style={{
            display:'inline-flex',
            alignItems:'center',
            gap:8,
            color:'#b5b2a9',
            fontSize:12,
            textDecoration:'none',
            transition:'color .2s ease',
          }}
        >
          <ArrowLeft aria-hidden="true" size={15}/>
          {t('expBack')}
        </Link>

        <div style={{display:'flex',alignItems:'center',gap:11,marginTop:26}}>
          <FlaskConical
            aria-hidden="true"
            size={22}
            strokeWidth={1.5}
            style={{color:'#d2af62'}}
          />
          <span style={{
            fontSize:11,
            letterSpacing:'0.15em',
            textTransform:'uppercase',
            color:'#d2af62',
            fontWeight:600,
          }}>
            {t('expBadge')}
          </span>
        </div>

        <h1 style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:'clamp(27px, 3.4vw, 40px)',
          fontWeight:500,
          lineHeight:1.3,
          letterSpacing:'-.045em',
          color:'#ece9e2',
          margin:'16px 0 0',
        }}>
          {t('expTitle')}
        </h1>

        <p style={{
          marginTop:16,
          maxWidth:620,
          color:'#b5b2a9',
          fontSize:15,
          lineHeight:1.75,
        }}>
          {t('expCopy')}
        </p>
      </section>

      {step===1?(
        <>
          <MapGuide/>
          <div style={{display:'flex',justifyContent:'center',marginTop:34,marginBottom:40}}>
            <Button
              size="lg"
              style={{minHeight:44,paddingInline:20}}
              onClick={next}
            >
              {t('expNext')}
              <ChevronRight aria-hidden="true" size={16}/>
            </Button>
          </div>
        </>
      ):(
        <>
          <div style={{display:'flex',justifyContent:'flex-start',marginTop:-6}}>
            <Button
              variant="outline"
              size="sm"
              style={{height:32,paddingInline:12}}
              onClick={backMap}
            >
              <ChevronRight aria-hidden="true" size={14} className="-rotate-180"/>
              {t('expBackMap')}
            </Button>
          </div>
          <TurnSimulator bare/>
        </>
      )}
    </motion.div>
  )
}
