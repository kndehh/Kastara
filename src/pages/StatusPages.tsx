import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import {Layers3,ArrowLeft,LockKeyhole,BookOpen} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'
import {clamp} from '@/lib/utils'
import {Button} from '@/components/ui/button'

export function ConfirmationPage(){
  const {t}=useCopy()
  return (
    <motion.div
      style={{
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
        paddingTop:92,
        paddingBottom:92,
      }}
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:.4}}
    >
      <div className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] document-page">
        <LockKeyhole className="section-icon" size={40} style={{color:'#d2af62'}}/>
        <h1 style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:28,
          fontWeight:500,
          lineHeight:1.3,
          letterSpacing:'-.04em',
          color:'#ece9e2',
          marginTop:20,
        }}>
          {t('orderTitle')}
        </h1>
        <p style={{
          fontSize:14,
          lineHeight:1.8,
          color:'#b5b2a9',
          marginTop:12,
          maxWidth:500,
        }}>
          {t('orderCopy')}
        </p>
        <p className="service-status" style={{
          marginTop:16,
          padding:12,
          background:'rgba(210,175,98,0.06)',
          border:'1px solid rgba(210,175,98,0.12)',
          borderRadius:6,
          fontSize:12,
          color:'#d2af62',
        }}>
          {t('backendBlocked')}
        </p>
        <Button asChild variant="outline" style={{marginTop:24}}>
          <Link to="/">
            <ArrowLeft aria-hidden="true" size={16}/>
            {t('back')}
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

export function PrivacyPage(){
  const {t}=useCopy()
  return (
    <motion.div
      style={{
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
        paddingTop:92,
        paddingBottom:92,
      }}
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:.4}}
    >
      <div className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] document-page">
        <BookOpen className="section-icon" size={40} style={{color:'#d2af62'}}/>
        <h1 style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:28,
          fontWeight:500,
          lineHeight:1.3,
          letterSpacing:'-.04em',
          color:'#ece9e2',
          marginTop:20,
        }}>
          {t('privacyTitle')}
        </h1>
        <p style={{
          fontSize:14,
          lineHeight:1.8,
          color:'#b5b2a9',
          marginTop:12,
          maxWidth:500,
        }}>
          {t('privacyCopy')}
        </p>
        <h2 style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:16,
          fontWeight:500,
          color:'#ece9e2',
          letterSpacing:'-.03em',
          marginTop:24,
        }}>
          {t('notPublished')}
        </h2>
        <p style={{
          fontSize:14,
          lineHeight:1.8,
          color:'#b5b2a9',
          marginTop:8,
          maxWidth:500,
        }}>
          {t('privacyPending')}
        </p>
        <Button asChild variant="outline" style={{marginTop:24}}>
          <Link to="/">
            <ArrowLeft aria-hidden="true" size={16}/>
            {t('back')}
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

export function NotFoundPage(){
  const {t}=useCopy()
  return (
    <motion.div
      style={{
        minHeight:'60vh',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        padding:'80px 24px',
        textAlign:'center',
        gap:32,
      }}
      initial={{opacity:0,y:24}}
      animate={{opacity:1,y:0}}
      transition={{duration:.5}}
    >
      {/* Visual: stylized 404 card */}
      <motion.div
        style={{
          position:'relative',
          width:180,
          height:240,
          borderRadius:12,
          border:'1px solid rgba(210,175,98,0.15)',
          background:'linear-gradient(180deg,#1a1b1f 0%,#141518 100%)',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          gap:12,
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
          overflow:'hidden',
        }}
        animate={{
          borderColor:['rgba(210,175,98,0.15)','rgba(210,175,98,0.3)','rgba(210,175,98,0.15)'],
        }}
        transition={{
          borderColor:{duration:3,repeat:Infinity,ease:'easeInOut'},
        }}
      >
        {/* Glow effect */}
        <motion.div
          aria-hidden="true"
          style={{
            position:'absolute',
            inset:0,
            background:'radial-gradient(ellipse at center,rgba(210,175,98,0.12) 0%, transparent 70%)',
            pointerEvents:'none',
          }}
          animate={{
            background:['radial-gradient(ellipse at center,rgba(210,175,98,0.08) 0%, transparent 70%)','radial-gradient(ellipse at center,rgba(210,175,98,0.18) 0%, transparent 70%)','radial-gradient(ellipse at center,rgba(210,175,98,0.08) 0%, transparent 70%)'],
          }}
          transition={{
            background:{duration:3,repeat:Infinity,ease:'easeInOut'},
          }}
        />

        {/* Decorative seal */}
        <motion.div
          style={{
            color:'#d2af62',
            opacity:.7,
            transform:'rotate(45deg)',
          }}
          animate={{
            rotate:[-45,-55,-45],
            scale:[1,1.05,1],
          }}
          transition={{
            repeat:Infinity,
            duration:3,
            ease:'easeInOut',
          }}
        >
          <Layers3 size={48} strokeWidth={.9}/>
        </motion.div>

        {/* 404 code */}
        <motion.span
          style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:48,
            fontWeight:700,
            color:'#d2af62',
            letterSpacing:'-.05em',
            lineHeight:1,
          }}
          initial={{opacity:0,scale:.8}}
          animate={{opacity:1,scale:1}}
          transition={{delay:.3,duration:.4}}
        >
          404
        </motion.span>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          maxWidth:400,
        }}
        initial={{opacity:0,y:12}}
        animate={{opacity:1,y:0}}
        transition={{delay:.35,duration:.4}}
      >
        <h1 style={{
          fontFamily:'"Unbounded",sans-serif',
          fontSize:clamp(28,4,40),
          fontWeight:500,
          lineHeight:1.25,
          letterSpacing:'-.04em',
          color:'#ece9e2',
          margin:0,
        }}>
          {t('notFound')}
        </h1>
        <p style={{
          fontSize:14,
          lineHeight:1.7,
          color:'#b5b2a9',
          maxWidth:320,
          margin:16,
        }}>
          {t('notFoundCopy')}
        </p>

        <div style={{
          display:'flex',
          gap:12,
          justifyContent:'center',
          marginTop:28,
          flexWrap:'wrap',
        }}>
          <Button asChild size="lg">
            <Link to="/">
              <ArrowLeft aria-hidden="true" size={16}/>
              {t('back')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/" state={{scrollTo:'kartu'}}>
              {t('viewCards')}
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Footer note */}
      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:.5,duration:.4}}
        style={{
          textAlign:'center',
          fontSize:11,
          color:'#5a5b5e',
          paddingTop:20,
          borderTop:'1px solid rgba(38,39,43,0.5)',
          maxWidth:400,
        }}
      >
        <p>{t('preview')}</p>
      </motion.div>
    </motion.div>
  )
}
