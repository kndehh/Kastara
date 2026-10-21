export { cn } from "cn"

/** Builds a fluid CSS clamp() length, e.g. clamp(25px, 3vw, 37px). */
export function clamp(min:number,viewport:number,max:number){
  return `clamp(${min}px, ${viewport}vw, ${max}px)`
}

const HEADER_OFFSET=100
let scrollFrame:number|undefined

function easeInOutCubic(progress:number){
  return progress<.5?4*progress*progress*progress:1-Math.pow(-2*progress+2,3)/2
}

/** Scrolls to a section under the sticky header with a consistent ease-in-out animation. */
export function scrollToSection(id:string){
  const target=document.getElementById(id)
  if(!target) return

  const start=window.scrollY
  const destination=Math.max(0,target.getBoundingClientRect().top+start-HEADER_OFFSET)
  const distance=destination-start
  if(Math.abs(distance)<1) return

  if(scrollFrame!==undefined) cancelAnimationFrame(scrollFrame)

  const duration=Math.min(800,Math.max(450,Math.abs(distance)*.6))
  let startedAt:number|undefined
  const animate=(timestamp:number)=>{
    startedAt??=timestamp
    const progress=Math.min((timestamp-startedAt)/duration,1)
    window.scrollTo({top:start+distance*easeInOutCubic(progress)})
    if(progress<1) scrollFrame=requestAnimationFrame(animate)
    else scrollFrame=undefined
  }

  scrollFrame=requestAnimationFrame(animate)
}

/** Immediately returns the page to the top and cancels any active section animation. */
export function scrollToTop(){
  if(scrollFrame!==undefined){
    cancelAnimationFrame(scrollFrame)
    scrollFrame=undefined
  }
  window.scrollTo({top:0})
}

