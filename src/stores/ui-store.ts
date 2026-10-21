import {create} from 'zustand'
import type {Locale} from '@/i18n'
function storedLocale():Locale {try{return localStorage.getItem('nc-locale')==='en'?'en':'id'}catch{return 'id'}}
interface UiState {locale:Locale;selectedCardId:string|null;selectedPackageId:string|null;setLocale:(locale:Locale)=>void;selectCard:(id:string|null)=>void;selectPackage:(id:string|null)=>void}
export const useUiStore=create<UiState>(set=>({locale:storedLocale(),selectedCardId:null,selectedPackageId:null,setLocale:locale=>{try{localStorage.setItem('nc-locale',locale)}catch{/* Storage is optional. */}set({locale})},selectCard:selectedCardId=>set({selectedCardId}),selectPackage:selectedPackageId=>set({selectedPackageId})}))
