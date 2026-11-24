export { cn } from "cn"

/** Builds a fluid CSS clamp() length, e.g. clamp(25px, 3vw, 37px). */
export function clamp(min:number,viewport:number,max:number){
  return `clamp(${min}px, ${viewport}vw, ${max}px)`
}

const HEADER_OFFSET=100

function scrollBehavior():ScrollBehavior{
  if(typeof window.matchMedia!=="function") return "smooth"
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"
}

/** Scrolls to a section under the sticky header with smooth scroll. */
export function scrollToSection(id:string){
  const target=document.getElementById(id)
  if(!target) return
  const destination=Math.max(0,target.getBoundingClientRect().top+window.scrollY-HEADER_OFFSET)
  window.scrollTo({top:destination,behavior:scrollBehavior()})
}

/** Returns the page to the top, smooth unless reduced motion is requested. */
export function scrollToTop(){
  window.scrollTo({top:0,behavior:scrollBehavior()})
}
