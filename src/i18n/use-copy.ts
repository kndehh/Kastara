import {translate, type Dictionary} from './index'
import {useUiStore} from '@/stores/ui-store'
export function useCopy(){const locale=useUiStore(s=>s.locale);return {locale,t:(key:keyof Dictionary)=>translate(locale,key)}}
