import {useEffect,useState} from 'react'

/**
 * Debounce a fast-changing value. Keeps expensive work (filtering, fetching)
 * off the keystroke path so typing stays responsive.
 */
export function useDebouncedValue<T>(value:T,delay:number):T{
  const [debounced,setDebounced]=useState(value)

  useEffect(()=>{
    const timer=window.setTimeout(()=>setDebounced(value),delay)
    return ()=>window.clearTimeout(timer)
  },[value,delay])

  return debounced
}
