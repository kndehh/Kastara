import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import {ArrowLeft,FlaskConical} from 'lucide-react'
import {TurnSimulator} from '@/components/TurnSimulator'
import {MapGuide} from '@/components/MapGuide'
import {useCopy} from '@/i18n/use-copy'

export function ExperimentPage(){
  const {t}=useCopy()
  return (
    <motion.div
      className="max-w-[1216px] my-0 mx-auto px-[48px] w-full max-[767px]:px-[20px]"
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

      <TurnSimulator bare/>
      <MapGuide/>
    </motion.div>
  )
}
