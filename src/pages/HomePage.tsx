import {motion,AnimatePresence,useReducedMotion} from 'framer-motion'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import {ArrowRight,ArrowUpRight,LockKeyhole,Layers3,Circle,MoveUp,CircleDot,RotateCw,Navigation,EyeOff,Hand,Shield,Battery,BadgePlus,Zap,ChevronDown} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Gallery} from '@/components/Gallery'
import {GameplayFlow} from '@/components/GameplayFlow'
import {publishedCards} from '@/data/cards'
import type {Dictionary} from '@/i18n'
import {clamp} from '@/lib/utils'

const mechanics=[
  { name: 'Gundu', body: 'gundu', icon: Circle },
  { name: 'Gasing', body: 'gasing', icon: RotateCw },
  { name: 'Egrang', body: 'egrang', icon: MoveUp },
  { name: 'Layangan', body: 'layangan', icon: Navigation },
  { name: 'Petak Umpet', body: 'petakUmpet', icon: EyeOff },
  { name: 'Congklak', body: 'congklak', icon: CircleDot },
  { name: 'Bekel', body: 'bekel', icon: Hand },
  { name: 'Gobak Sodor', body: 'gobakSodor', icon: Shield },
] as const satisfies Array<{ name: string; body: keyof Dictionary; icon: typeof Circle }>

const cardTypes=[
  {key:'energy',copyKey:'typeEnergyCopy',icon:Battery},
  {key:'character',copyKey:'typeCharacterCopy',icon:BadgePlus},
  {key:'power_up',copyKey:'typePowerUpCopy',icon:Zap},
] as const satisfies Array<{key:keyof Dictionary;copyKey:keyof Dictionary;icon:typeof Battery}>

function FloatingCardStudy(){
  const {locale}=useCopy()
  const arka=publishedCards.find(item=>item.id==='kst-arka')
  const laras=publishedCards.find(item=>item.id==='kst-laras')
  const gundu=publishedCards.find(item=>item.id==='kst-gundu')
  if(!arka?.art) return null
  return (
    <motion.figure
      className="min-w-0 flex flex-col items-center pt-[20px] px-0 pb-0 [&_figcaption]:flex [&_figcaption]:flex-col [&_figcaption]:items-center [&_figcaption]:gap-[3px] [&_figcaption]:mt-[10px] [&_figcaption]:text-center [&_figcaption]:leading-[1.5] [&_figcaption]:max-w-[300px] [&_figcaption_span]:text-[12px] [&_figcaption_span]:text-[var(--primary)] [&_figcaption_small]:text-[9px] [&_figcaption_small]:tracking-[.12em] [&_figcaption_small]:uppercase [&_figcaption_small]:text-[#6f7175] max-[767px]:pt-[26px] max-[767px]:[&_figcaption]:text-[11px] max-[767px]:[&_figcaption]:mt-[6px]"
      initial={{opacity:0,y:20,scale:.95}}
      animate={{opacity:1,y:0,scale:1}}
      transition={{duration:.7,ease:'easeOut'}}
    >
      <motion.div
        className="relative w-[340px] h-[370px] max-[1023px]:[transform:scale(.85)] max-[1023px]:w-[290px] max-[1023px]:h-[335px] max-[1023px]:[transform-origin:center_center] max-[767px]:h-[320px] max-[767px]:w-[310px] max-[767px]:[transform:scale(.82)]"
        initial="rest"
        animate="rest"
        whileHover="hover"
      >
        <motion.div
          className="absolute left-[60px] top-[8px] w-[230px] h-[325px] rounded-[12px] border border-[#4d4737] bg-[#141518] overflow-hidden [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-cover max-[1023px]:left-[36px] max-[767px]:left-[51px] [transform:rotate(-16deg)_translateX(-30px)]"
          aria-hidden="true"
          variants={{
            rest:{rotate:-16,x:-30,y:0},
            hover:{rotate:-22,x:-40,y:-7},
          }}
          transition={{type:'spring',stiffness:260,damping:22}}
        >
          {laras?.art&&<img src={laras.art} alt="" width={659} height={923}/>}
        </motion.div>
        <motion.div
          className="absolute left-[60px] top-[8px] w-[230px] h-[325px] rounded-[12px] border border-[#6d5c38] bg-[#141518] overflow-hidden [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-cover max-[1023px]:left-[36px] max-[767px]:left-[51px] [transform:rotate(-4deg)_translateX(-12px)]"
          aria-hidden="true"
          variants={{
            rest:{rotate:-4,x:-12,y:0},
            hover:{rotate:-11,x:-22,y:-10},
          }}
          transition={{type:'spring',stiffness:260,damping:22}}
        >
          {gundu?.art&&<img src={gundu.art} alt="" width={659} height={923}/>}
        </motion.div>
        <motion.div
          className="absolute left-[60px] top-[8px] w-[230px] h-[325px] rounded-[12px] border border-[#927b45] [transform:rotate(8deg)] overflow-hidden shadow-[16px_20px_50px_#050606a0] bg-[#141518] [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-cover max-[1023px]:left-[36px] max-[767px]:left-[51px]"
          variants={{
            rest:{rotate:8,y:0,scale:1,boxShadow:'16px 20px 50px rgba(0,0,0,0.6)'},
            hover:{rotate:4,y:-14,scale:1.035,boxShadow:'22px 30px 70px rgba(0,0,0,0.7), 0 0 32px rgba(210,175,98,0.14)'},
          }}
          transition={{type:'spring',stiffness:260,damping:22}}
        >
          <img
            src={arka.art}
            alt={`${arka.name[locale]} ${arka.setCode}`}
            width={659}
            height={923}
          />
        </motion.div>
      </motion.div>
      <figcaption>
        <span>{arka.name[locale]}</span>
        <small>{arka.setCode} · Rare</small>
      </figcaption>
    </motion.figure>
  )
}

export function HomePage(){
  const {t}=useCopy()
  const [openFaq,setOpenFaq]=useState<string|null>(null)

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
      transition={{duration:.6,ease:'easeOut'}}
    >
      {/* Hero */}
      <section className="grid grid-cols-[1.2fr_1fr] items-center gap-[35px] min-h-[580px] pt-[42px] px-0 pb-[36px] [&_h1]:text-[clamp(34px,4.3vw,56px)] [&_h1]:leading-[1.25] [&_h1]:mt-[24px] [&_h1]:mx-0 [&_h1]:mb-[22px] [&_h1]:tracking-[-.065em] [&_h1_em]:[font-style:normal] [&_h1_em]:text-[var(--primary)] max-[1023px]:grid-cols-[1.1fr_1fr] max-[1023px]:gap-[10px] max-[1023px]:min-h-[530px] max-[1023px]:[&_h1]:text-[39px] max-[767px]:grid-cols-[1fr] max-[767px]:gap-[0] max-[767px]:pt-[44px] max-[767px]:pb-[24px] max-[767px]:[&_h1]:text-[clamp(31px,7.6vw,51px)] max-[767px]:[&_h1]:mt-[20px] max-[767px]:[&_h1]:tracking-[-.06em]">
        <motion.div
          className="hero-copy"
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:.5,delay:.1}}
        >
          <p style={{
            fontSize:11,
            letterSpacing:'0.15em',
            textTransform:'uppercase',
            color:'#d2af62',
            fontWeight:600,
            margin:0,
          }}>
            {t('heroEyebrow')}
          </p>
          <h1 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:clamp(34,4.3,56),
            lineHeight:1.25,
            margin:'24px 0 22px',
            letterSpacing:'-.065em',
            color:'#ece9e2',
          }}>
            <span className="absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0">Kastara</span>
            <span aria-hidden="true">
              {t('heroLine1')}
              <br/>
              <em style={{color:'#d2af62'}}>{t('heroLine2')}</em>
            </span>
          </h1>
          <p style={{
            fontSize:16,
            maxWidth:450,
            lineHeight:1.85,
            color:'#b5b2a9',
          }}>
            {t('heroCopy')}
          </p>
          <div style={{
            display:'flex',
            gap:14,
            flexWrap:'wrap',
            marginTop:32,
          }}>
            <Button
              asChild
              size="lg"
              style={{
                minHeight:48,
                paddingInline:22,
                fontSize:13,
              }}
            >
              <Link to="/" state={{scrollTo:'kartu'}} style={{display:'flex',alignItems:'center',gap:6}}>
                {t('viewCards')}
                <ArrowRight aria-hidden="true" size={16}/>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              style={{
                minHeight:48,
                paddingInline:22,
                fontSize:13,
              }}
            >
              <Link to="/" state={{scrollTo:'paket'}} style={{display:'flex',alignItems:'center',gap:6}}>
                {t('viewPackages')}
                <ArrowUpRight aria-hidden="true" size={14}/>
              </Link>
            </Button>
          </div>
        </motion.div>

        <FloatingCardStudy/>
      </section>

      <GameplayFlow/>

      {/* About / mechanics */}
      <section id="tentang" className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] py-[92px] px-0 border-b border-[#26272b] max-[767px]:py-[62px] max-[767px]:px-0">
        <motion.div
          className="max-w-[730px] mb-[38px] [&_p]:mt-[18px] [&_p]:max-w-[650px] max-[767px]:mb-[30px] max-[767px]:[&_p]:text-[13px]"
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4}}
        >
          <h2 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:clamp(25,3,37),
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            margin:0,
          }}>
            {t('aboutTitle')}
          </h2>
          <p style={{
            marginTop:18,
            maxWidth:650,
            color:'#b5b2a9',
            fontSize:15,
            lineHeight:1.7,
          }}>
            {t('aboutCopy')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-[repeat(3,1fr)] gap-[16px] mt-[44px] max-[767px]:grid-cols-[1fr] max-[767px]:gap-[12px] max-[767px]:mt-[30px]"
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4,delay:.1}}
        >
          {cardTypes.map((ct,i)=>(
            <motion.article
              key={ct.key}
              className="flex flex-col gap-[12px] py-[24px] px-[22px] bg-[linear-gradient(180deg,#17181b_0%,#121315_100%)] border border-[rgba(44,45,49,0.7)] rounded-[10px] max-[767px]:py-[20px] max-[767px]:px-[18px]"
              initial={{opacity:0,y:16}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{duration:.4,delay:.1+i*.07}}
              whileHover={{y:-4}}
            >
              <ct.icon
                aria-hidden="true"
                size={26}
                strokeWidth={1.3}
                style={{color:'#d2af62'}}
              />
              <h3 style={{
                fontFamily:'"Unbounded",sans-serif',
                fontSize:16,
                fontWeight:500,
                letterSpacing:'-.03em',
                color:'#ece9e2',
                margin:0,
              }}>
                {t(ct.key)}
              </h3>
              <p style={{
                fontSize:13,
                lineHeight:1.75,
                margin:0,
                color:'#b5b2a9',
              }}>
                {t(ct.copyKey)}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-[repeat(4,1fr)] gap-[14px] mt-[14px] pt-[26px] border-t border-[rgba(38,39,43,0.6)] max-[767px]:grid-cols-[1fr_1fr] max-[767px]:gap-[12px] max-[767px]:mt-[12px] max-[767px]:pt-[20px]"
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4,delay:.15}}
        >
          {mechanics.map((m,i)=>(
            <motion.article
              key={m.name}
              className="flex flex-col gap-[9px] pt-[16px] px-[14px] pb-[18px] border border-[rgba(44,45,49,0.55)] rounded-[8px] bg-[rgba(23,24,27,0.55)]"
              initial={{opacity:0,y:16}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{duration:.4,delay:.15+i*.06}}
              whileHover={{y:-3}}
            >
              <m.icon
                aria-hidden="true"
                size={22}
                strokeWidth={1.3}
                style={{color:'#d2af62'}}
              />
              <h3 style={{
                fontFamily:'"Unbounded",sans-serif',
                fontSize:14,
                fontWeight:500,
                letterSpacing:'-.02em',
                color:'#ece9e2',
                margin:0,
              }}>
                {m.name}
              </h3>
              <p style={{
                fontSize:12,
                lineHeight:1.7,
                margin:0,
                color:'#b5b2a9',
              }}>
                {t(m.body)}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Gallery */}
      <Gallery cards={publishedCards}/>

      {/* Packages */}
      <section id="paket" style={{
        padding:'92px 0',
        borderBottom:'1px solid rgba(38,39,43,0.5)',
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
      }}>
        <motion.div
          style={{
            maxWidth:730,
            marginBottom:38,
          }}
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4}}
        >
          <h2 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:clamp(25,3,37),
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            margin:0,
          }}>
            {t('packageTitle')}
          </h2>
          <p style={{
            marginTop:18,
            maxWidth:650,
            color:'#b5b2a9',
            fontSize:15,
            lineHeight:1.7,
          }}>
            {t('packageCopy')}
          </p>
        </motion.div>

        <motion.div
          style={{
            display:'grid',
            gridTemplateColumns:'repeat(2,1fr)',
            gap:24,
          }}
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4,delay:.1}}
        >
          {[
            {key:'starter',iconSize:48},
            {key:'booster',iconSize:70},
          ].map((pack,i)=>(
            <motion.article
              key={pack.key}
              style={{
                position:'relative',
                padding:28,
                background:'linear-gradient(180deg,#1b1c20 0%,#121315 100%)',
                border:'1px solid rgba(44,45,49,0.8)',
                borderRadius:12,
                display:'flex',
                flexDirection:'column',
                gap:16,
                overflow:'hidden',
                transition:'border-color .25s ease',
              }}
              whileHover={{borderColor:'rgba(210,175,98,0.35)',y:-3}}
              initial={{opacity:0,y:16}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{duration:.4,delay:.15+i*.08}}
            >
              {/* Decorative icon */}
              <div style={{
                position:'absolute',
                right:-20,
                top:-20,
                opacity:.06,
                pointerEvents:'none',
              }}>
                <Layers3
                  strokeWidth={1}
                  size={pack.iconSize}
                  style={{color:'#d2af62'}}
                />
              </div>
              <div style={{
                display:'flex',
                alignItems:'center',
                gap:12,
              }}>
                <div style={{
                  width:48,
                  height:48,
                  borderRadius:10,
                  background:'rgba(210,175,98,0.06)',
                  border:'1px solid rgba(210,175,98,0.12)',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                }}>
                  <Layers3
                    strokeWidth={1}
                    size={pack.iconSize}
                    style={{color:'#d2af62',opacity:.5}}
                  />
                </div>
                <div>
                  <span style={{
                    fontSize:9,
                    color:'#85878b',
                    textTransform:'uppercase',
                    letterSpacing:'0.06em',
                  }}>
                    {t('notPublished')}
                  </span>
                  <h3 style={{
                    fontFamily:'"Unbounded",sans-serif',
                    fontSize:18,
                    fontWeight:500,
                    color:'#ece9e2',
                    letterSpacing:'-.03em',
                    margin:4,
                  }}>
                    {t(pack.key as keyof Dictionary)}
                  </h3>
                  <p style={{
                    fontSize:11,
                    lineHeight:1.7,
                    color:'#b5b2a9',
                    margin:0,
                    maxWidth:280,
                  }}>
                    {t(pack.key==='starter'?'starterCopy':'boosterCopy')}
                  </p>
                </div>
              </div>
              <div style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'spaceBetween',
                flexWrap:'wrap',
                gap:10,
              }}>
                <strong style={{
                  fontFamily:'"Unbounded",sans-serif',
                  fontSize:14,
                  color:'#d2af62',
                  letterSpacing:'0.02em',
                }}>
                  {t('pricePending')}
                </strong>
                <Button
                  variant="outline"
                  disabled
                  className="border-[rgba(210,175,98,0.28)]! bg-[rgba(210,175,98,0.07)]! text-[#cfc4a3]! opacity-[1] disabled:opacity-[1] disabled:cursor-not-allowed disabled:filter-none [&_svg]:text-[#d2af62]"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:6,
                  }}
                >
                  <LockKeyhole aria-hidden="true" size={14}/>
                  {t('notAvailable')}
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          style={{
            marginTop:28,
            padding:20,
            background:'rgba(210,175,98,0.03)',
            border:'1px solid rgba(210,175,98,0.08)',
            borderRadius:8,
          }}
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          viewport={{once:true}}
        >
          <h3 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:15,
            fontWeight:500,
            color:'#ece9e2',
            letterSpacing:'-.03em',
            margin:0,
          }}>
            {t('progress')}
          </h3>
          <p style={{
            fontSize:11,
            lineHeight:1.7,
            color:'#85878b',
            margin:'6px 0 0',
          }}>
            {t('progressCopy')}
          </p>
        </motion.div>
      </section>

      {/* Pre-order */}
      <section id="preorder" style={{
        padding:'92px 0',
        borderBottom:'1px solid rgba(38,39,43,0.5)',
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
      }}>
        <motion.div
          className="[&_h2]:text-[28px] [&_h2]:mb-[20px] [&_p]:text-[13px] [&_p]:mb-[14px] max-[767px]:[&_p]:text-[13px] max-[767px]:[&_h2]:text-[22px]"
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4}}
        >
          <h2 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:clamp(25,3,37),
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            marginTop:12,
          }}>
            {t('poTitle')}
          </h2>
          <p style={{
            fontSize:15,
            lineHeight:1.7,
            color:'#b5b2a9',
            marginTop:12,
            maxWidth:500,
          }}>
            {t('poCopy')}
          </p>
          <div
            className="service-status"
            role="status"
            style={{
              marginTop:16,
              padding:10,
              background:'rgba(210,175,98,0.06)',
              border:'1px solid rgba(210,175,98,0.12)',
              borderRadius:6,
              fontSize:12,
              color:'#d2af62',
            }}
          >
            <span>{t('poBadge')}</span>
          </div>
        </motion.div>

        <motion.div
          className="[&_h3]:max-w-[460px] [&_h3]:leading-[1.4] flex flex-col items-center text-center gap-[18px] py-[56px] px-[32px] bg-[rgba(10,11,13,0.5)] border border-dashed border-[rgba(44,45,49,0.7)] rounded-[12px] [&_h3]:font-heading [&_h3]:text-[20px] [&_h3]:font-medium [&_h3]:tracking-[-.03em] [&_h3]:text-[var(--foreground)] [&_h3]:m-0 [&_p]:text-[13px] [&_p]:leading-[1.75] [&_p]:text-[var(--muted-foreground)] [&_p]:m-0 [&_p]:max-w-[420px] max-[767px]:py-[40px] max-[767px]:px-[22px]"
          initial={{opacity:0,scale:.98}}
          whileInView={{opacity:1,scale:1}}
          viewport={{once:true}}
          transition={{duration:.4}}
        >
          <span className="inline-block py-[5px] px-[13px] rounded-[999px] border border-[rgba(210,175,98,0.3)] bg-[rgba(210,175,98,0.08)] text-[#d2af62] font-heading text-[10px] font-semibold tracking-[0.1em] uppercase">{t('poFlag')}</span>
          <h3>{t('poCardTitle')}</h3>
          <p>{t('poCardCopy')}</p>
        </motion.div>
      </section>

      {/* Lore */}
      <section id="lore" style={{
        padding:'92px 0',
        borderBottom:'1px solid rgba(38,39,43,0.5)',
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
      }}>
        <motion.div
          className="max-w-[760px]"
          initial={{opacity:0,y:20}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.5}}
        >
          <p style={{
            fontSize:11,
            letterSpacing:'0.15em',
            textTransform:'uppercase',
            color:'#d2af62',
            fontWeight:600,
            margin:'0 0 14px',
          }}>
            {t('lore')}
          </p>
          <h2 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:'clamp(25px, 3.2vw, 39px)',
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            margin:0,
            maxWidth:760,
          }}>
            {t('loreTitle')}
          </h2>
          <motion.p
            style={{
              fontSize:15,
              lineHeight:1.85,
              color:'#b5b2a9',
              maxWidth:640,
              margin:'20px 0 0',
            }}
            initial={{opacity:0}}
            whileInView={{opacity:1}}
            viewport={{once:true}}
            transition={{duration:.6,delay:.15}}
          >
            {t('loreCopy')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-[repeat(3,1fr)] gap-[14px] mt-[52px]"
          initial={{opacity:0,y:18}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.5,delay:.1}}
        >
          {(['loreCard1','loreCard2','loreCard3'] as const).map((k,i)=>(
            <motion.article
              key={k}
              className="relative pt-[24px] px-[22px] pb-[26px] bg-[linear-gradient(180deg,#16171a_0%,#111215_100%)] border border-[rgba(44,45,49,0.6)] rounded-[10px] overflow-hidden after:content-[''] after:absolute after:left-0 after:right-0 after:top-0 after:h-[1px] after:bg-[linear-gradient(90deg,transparent,rgba(210,175,98,0.35),transparent)] after:opacity-[0] after:transition-opacity after:duration-[.3s] hover:after:opacity-[1] [&_h3]:font-heading [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:tracking-[-0.025em] [&_h3]:text-[#ece9e2] [&_h3]:mt-[14px] [&_h3]:mx-0 [&_h3]:mb-0 [&_h3]:leading-[1.4] [&_p]:text-[12.5px] [&_p]:leading-[1.8] [&_p]:text-[#a8a6a0] [&_p]:mt-[11px] [&_p]:mx-0 [&_p]:mb-0"
              initial={{opacity:0,y:18}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{duration:.4,delay:.1+i*.08}}
              whileHover={{y:-4}}
            >
              <span className="font-heading text-[10px] tracking-[0.14em] text-[#d2af62] opacity-[.75]" aria-hidden="true">
                {String(i+1).padStart(2,'0')}
              </span>
              <h3>{t(`${k}Title` as keyof Dictionary)}</h3>
              <p>{t(`${k}Copy` as keyof Dictionary)}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{
        padding:'92px 0',
        borderBottom:'1px solid rgba(38,39,43,0.5)',
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
      }}>
        <motion.h2
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:clamp(25,3,37),
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            marginBottom:28,
          }}
        >
          {t('faqTitle')}
        </motion.h2>

        <motion.div
          style={{
            display:'flex',
            flexDirection:'column',
            gap:12,
          }}
          initial={{opacity:0,y:12}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.35,delay:.1}}
        >
          {(['1','2','3','4'] as const).map((n,i)=>(
            <FaqItem
              key={n}
              n={n}
              index={i}
              open={openFaq===n}
              onToggle={()=>setOpenFaq(prev=>prev===n?null:n)}
            />
          ))}
        </motion.div>
      </section>

      {/* Waitlist */}
      <section style={{
        padding:'92px 0',
        maxWidth:1216,
        margin:'0 auto',
        paddingLeft:48,
        paddingRight:48,
        width:'100%',
        display:'flex',
        gap:40,
        alignItems:'center',
        flexWrap:'wrap',
      }}>
        <motion.div
          style={{
            flex:1,
            minWidth:250,
          }}
          initial={{opacity:0,y:12}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4}}
        >
          <h2 style={{
            fontFamily:'"Unbounded",sans-serif',
            fontSize:clamp(25,3,37),
            fontWeight:500,
            lineHeight:1.3,
            letterSpacing:'-.045em',
            textWrap:'balance',
            color:'#ece9e2',
            margin:0,
          }}>
            {t('waitTitle')}
          </h2>
          <p style={{
            fontSize:15,
            lineHeight:1.7,
            color:'#b5b2a9',
            marginTop:12,
            maxWidth:380,
          }}>
            {t('waitCopy')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={e=>e.preventDefault()}
          aria-describedby="wait-locked"
          style={{
            display:'flex',
            gap:12,
            alignItems:'flexStart',
            flexWrap:'wrap',
          }}
          initial={{opacity:0,y:12}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.4,delay:.1}}
        >
          <Label htmlFor="wait-email" style={{margin:0,fontSize:9,color:'#85878b',textTransform:'uppercase',letterSpacing:'0.07em'}}>
            {t('email')}
          </Label>
          <Input
            id="wait-email"
            type="email"
            disabled
            autoComplete="off"
            className="bg-[#1d1e22]! border border-[rgba(210,175,98,0.22)] rounded-[6px] text-[#cfc4a3] [font-size:12px]! [&_::placeholder]:text-[#8f8f95] disabled:opacity-[1]"
            style={{
              flex:1,
              minWidth:200,
              maxWidth:380,
              height:44,
            }}
          />
          <Button
            disabled
            className="border-[rgba(210,175,98,0.28)]! bg-[rgba(210,175,98,0.07)]! text-[#cfc4a3]! opacity-[1] disabled:opacity-[1] disabled:cursor-not-allowed disabled:filter-none [&_svg]:text-[#d2af62]"
            style={{
              display:'flex',
              alignItems:'center',
              gap:6,
            }}
          >
            <LockKeyhole aria-hidden="true" size={14}/>
            {t('waitLocked')}
          </Button>
        </motion.form>
        <p id="wait-locked" style={{
          fontSize:11,
          color:'#85878b',
          width:'100%',
          marginTop:8,
        }}>
          {t('noData')}
        </p>
      </section>
    </motion.div>
  )
}

function FaqItem({
  n,
  index,
  open,
  onToggle,
}:{
  n:'1'|'2'|'3'|'4'
  index:number
  open:boolean
  onToggle:()=>void
}){
  const {t}=useCopy()
  const reduce=useReducedMotion()
  const panelId=`faq-panel-${n}`
  const buttonId=`faq-button-${n}`

  return (
    <motion.div
      className="border border-[rgba(44,45,49,0.6)] rounded-[8px] bg-[rgba(23,24,27,0.5)] overflow-hidden transition-[background-color,border-color] duration-[.25s] hover:bg-[rgba(23,24,27,0.75)] hover:border-[rgba(210,175,98,0.18)] data-[open=true]:bg-[rgba(23,24,27,0.85)] data-[open=true]:border-[rgba(210,175,98,0.28)] [&>button]:w-full [&>button]:flex [&>button]:items-center [&>button]:justify-between [&>button]:gap-[14px] [&>button]:py-[15px] [&>button]:px-[16px] [&>button]:bg-transparent [&>button]:border-0 [&>button]:cursor-pointer [&>button]:text-left [&>button]:[font:inherit] [&>button>span:first-child]:font-heading [&>button>span:first-child]:text-[13px] [&>button>span:first-child]:font-medium [&>button>span:first-child]:text-[#ece9e2] [&>button>span:first-child]:leading-[1.55] [&>button>span:first-child]:tracking-[-.02em] max-[767px]:border max-[767px]:border-[var(--border)] max-[767px]:rounded-[8px] max-[767px]:bg-[#101113] max-[767px]:overflow-hidden"
      data-open={open}
      initial={{opacity:0,y:10}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true,margin:'-30px'}}
      transition={{duration:.35,delay:index*.06,ease:'easeOut'}}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{t(`q${n}`)}</span>
        <motion.span
          aria-hidden="true"
          className="shrink-[0] grid place-items-center w-[22px] h-[22px] rounded-[6px] bg-[rgba(210,175,98,0.1)] border border-[rgba(210,175,98,0.35)] text-[#e8cd8a] [&_svg]:block"
          animate={reduce?undefined:{rotate:open?180:0}}
          transition={{duration:.3,ease:'easeOut'}}
        >
          <ChevronDown size={14} strokeWidth={2.2}/>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open&&(
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="overflow-hidden [&_p]:m-0 [&_p]:[padding:0_16px_15px_16px] [&_p]:text-[12px] [&_p]:leading-[1.75] [&_p]:text-[#b5b2a9]"
            initial={{height:0,opacity:0}}
            animate={{height:'auto',opacity:1}}
            exit={{height:0,opacity:0}}
            transition={{duration:reduce?0:.3,ease:'easeOut'}}
          >
            <p>{t(`a${n}`)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
