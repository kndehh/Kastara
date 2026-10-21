import {motion} from 'framer-motion'
import {useEffect,useState} from 'react'
import {Link,Outlet,useLocation,useNavigate} from 'react-router-dom'
import {Menu,Layers3,ArrowUpRight} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'
import {useUiStore} from '@/stores/ui-store'
import {scrollToSection,scrollToTop} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogClose} from '@/components/ui/dialog'
import {Toaster} from '@/components/ui/sonner'

const SECTIONS=[{id:'tentang',key:'about'},{id:'kartu',key:'cards'},{id:'paket',key:'packages'},{id:'faq',key:'faq'}] as const

export function Shell(){
  const {locale,t}=useCopy()
  const setLocale=useUiStore(s=>s.setLocale)
  const [open,setOpen]=useState(false)
  const [section,setSection]=useState('')
  const location=useLocation()
  const navigate=useNavigate()
  const goToSection=(id:string)=>{
    setOpen(false)
    if(location.pathname==='/'){scrollToSection(id);return}
    navigate('/',{state:{scrollTo:id}})
  }
  const goHome=()=>{
    setOpen(false)
    scrollToTop()
  }

  const isSectionActive=(id:string)=>location.pathname==='/'&&section===id

  useEffect(()=>{
    document.documentElement.lang=locale
  },[locale])

  useEffect(()=>{
    if(location.pathname!=='/') scrollToTop()
  },[location.pathname])

  useEffect(()=>{
    const state=location.state as {scrollTo?:string}|null
    const id=location.hash.replace(/^#/,'')||state?.scrollTo
    if(location.pathname!=='/'||!id) return
    let frame=0
    let cancelled=false
    const align=()=>{
      if(cancelled) return
      scrollToSection(id)
    }
    frame=requestAnimationFrame(align)
    const timer=setTimeout(align,300)
    const onLoad=()=>align()
    window.addEventListener('load',onLoad)
    document.fonts?.ready.then(align)
    return ()=>{
      cancelled=true
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      window.removeEventListener('load',onLoad)
    }
  },[location])

  useEffect(()=>{
    if(location.pathname!=='/') return
    const onScroll=()=>{
      let current=''
      for(const item of SECTIONS){
        const target=document.getElementById(item.id)
        if(target&&target.getBoundingClientRect().top<=140) current=item.id
      }
      setSection(current)
    }
    onScroll()
    window.addEventListener('scroll',onScroll,{passive:true})
    return ()=>window.removeEventListener('scroll',onScroll)
  },[location.pathname])

  const mobileMenu=<Button className="min-[768px]:hidden max-[767px]:inline-flex max-[767px]:w-[40px] max-[767px]:h-[40px]" variant="outline" size="icon" aria-label={t('menu')}><Menu/></Button>

  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <motion.header
          className="h-[80px] sticky top-0 z-[20] bg-[#0b0c0ef5] border-b border-b-[#28292c] max-[767px]:h-[72px]"
          initial={{y:-100,opacity:0}}
          animate={{y:0,opacity:1}}
          transition={{duration:.5,delay:.1}}
          style={{
            height:80,
            position:'sticky',
            top:0,
            zIndex:20,
            background:'rgba(11,12,14,0.96)',
            borderBottom:'1px solid rgba(38,39,43,0.6)',
            backdropFilter:'blur(12px)',
          }}
        >
          <div className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] h-full grid grid-cols-[1fr_auto_1fr] items-center gap-[24px]">
            <Link to="/" onClick={goHome} className="[grid-column:1] flex items-center gap-[12px] font-heading text-[11px] leading-[1.5] tracking-[.14em] font-semibold justify-self-start [&>svg]:w-[33px] [&>svg]:h-[33px] [&>svg]:text-[var(--primary)] [&>svg]:[stroke-width:1.2] [&_b]:text-[19px] [&_b]:tracking-[.13em] max-[767px]:gap-[9px]" aria-label="Kastara">
              <Layers3 aria-hidden="true"/>
              <span>
                KASTARA
              </span>
            </Link>

            <nav className="[grid-column:2] flex items-center gap-[28px] text-[13px] justify-self-center [&_[data-nav]]:relative [&_[data-nav]]:py-[4px] [&_[data-nav]]:text-[var(--muted-foreground)] [&_[data-nav]:hover]:text-[var(--primary)] [&_[data-nav][data-status=active]]:text-[var(--primary)] [&_[data-nav][data-status=active]::after]:content-[''] [&_[data-nav][data-status=active]::after]:absolute [&_[data-nav][data-status=active]::after]:left-0 [&_[data-nav][data-status=active]::after]:right-0 [&_[data-nav][data-status=active]::after]:bottom-[-2px] [&_[data-nav][data-status=active]::after]:h-[1px] [&_[data-nav][data-status=active]::after]:bg-current max-[1023px]:gap-[22px] max-[767px]:hidden" aria-label={t('nav')}>
              {SECTIONS.map(item=>(
                <button key={item.id} type="button" data-nav data-status={isSectionActive(item.id)?'active':'inactive'} onClick={()=>goToSection(item.id)}>{t(item.key)}</button>
              ))}
              <span className="w-[1px] h-[14px] bg-[#34363b] mx-[-8px]" aria-hidden="true"/>
              <Link to="/experiment" data-nav data-status={location.pathname==='/experiment'?'active':'inactive'}>{t('experiment')}</Link>
            </nav>

            <div className="[grid-column:3] flex items-center gap-[14px] justify-self-end max-[767px]:gap-[10px]">
              <div className="flex items-center gap-[4px] text-[12px] [&_button]:w-[34px] [&_button]:min-h-[44px] [&_button]:text-[var(--muted-foreground)] [&_button[aria-pressed=true]]:text-[var(--primary)] [&_button[aria-pressed=true]]:font-semibold [&_span]:text-[#57585a]" aria-label="Language">
                <motion.button
                  onClick={()=>setLocale('id')}
                  aria-label="Bahasa Indonesia"
                  aria-pressed={locale==='id'}
                  whileTap={{scale:.92}}
                  style={{
                    width:34,
                    minHeight:44,
                    background:locale==='id'?'rgba(210,175,98,0.08)':'transparent',
                    border:'1px solid '+(locale==='id'?'rgba(210,175,98,0.2)':'transparent'),
                    borderRadius:5,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    cursor:'pointer',
                    fontSize:11,
                    fontWeight:600,
                    color:locale==='id'?'#d2af62':'#b5b2a9',
                    transition:'all .2s ease',
                  }}
                >
                  ID
                </motion.button>
                <span aria-hidden="true" style={{color:'#57585a',margin:0,padding:0}}>/</span>
                <motion.button
                  onClick={()=>setLocale('en')}
                  aria-label="English"
                  aria-pressed={locale==='en'}
                  whileTap={{scale:.92}}
                  style={{
                    width:34,
                    minHeight:44,
                    background:locale==='en'?'rgba(210,175,98,0.08)':'transparent',
                    border:'1px solid '+(locale==='en'?'rgba(210,175,98,0.2)':'transparent'),
                    borderRadius:5,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    cursor:'pointer',
                    fontSize:11,
                    fontWeight:600,
                    color:locale==='en'?'#d2af62':'#b5b2a9',
                    transition:'all .2s ease',
                  }}
                >
                  EN
                </motion.button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                {mobileMenu}
              </DialogTrigger>
              <DialogContent showCloseButton={false} aria-describedby={undefined}>
                <DialogTitle>{t('nav')}</DialogTitle>
                <motion.nav
                  className="grid gap-[20px] py-[18px] [&_button[data-nav]]:flex [&_button[data-nav]]:w-full [&_button[data-nav]]:items-center [&_button[data-nav]]:justify-between [&_button[data-nav]]:bg-transparent [&_button[data-nav]]:border-0 [&_button[data-nav]]:p-0 [&_button[data-nav]]:text-left [&_button[data-nav]]:text-[inherit] [&_button[data-nav][data-status=active]]:text-[var(--primary)]"
                  initial={{opacity:0,x:20}}
                  animate={{opacity:1,x:0}}
                  transition={{duration:.25}}
                >
                  {SECTIONS.map(item=>(
                    <button
                      key={item.id}
                      type="button"
                      data-nav
                      data-status={isSectionActive(item.id)?'active':'inactive'}
                      onClick={()=>goToSection(item.id)}
                    >
                      {t(item.key)}
                      <ArrowUpRight aria-hidden="true" size={18}/>
                    </button>
                  ))}
                  <div className="h-[1px] bg-[#34363b] my-[2px]" aria-hidden="true"/>
                  <Link className="flex w-full items-center justify-between" to="/experiment" data-nav data-status={location.pathname==='/experiment'?'active':'inactive'} onClick={()=>setOpen(false)}>
                    {t('experiment')}
                    <ArrowUpRight aria-hidden="true" size={18}/>
                  </Link>
                </motion.nav>
                <DialogClose asChild>
                  <Button variant="outline">{t('close')}</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        </motion.header>

        <main id="main" tabIndex={-1} className="flex-1">
          <Outlet/>
        </main>

        <footer
          className="bg-[#0a0b0d] border-t border-[var(--border)] pt-[50px] px-0 pb-[30px] max-[767px]:pt-[30px] max-[767px]:px-0 max-[767px]:pb-[20px]"
        >
          <div className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)]">
            <span className="block font-heading text-[13px] tracking-[.16em] font-semibold text-[var(--foreground)]">KASTARA</span>
            <p className="text-[12px] max-w-[380px] leading-[1.7] mt-[6px]">{t('footer')}</p>
          </div>
        </footer>
      </div>

      <Toaster position="bottom-right" richColors/>
    </>
  )
}
