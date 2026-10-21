import type { Locale } from '@/i18n'
export type LocalText = Record<Locale, string>
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'secret'
export type CardType = 'energy' | 'character' | 'power_up'
export type Element = 'api' | 'air' | 'tanah'
export type SourceGame =
  | 'Gundu'
  | 'Gasing'
  | 'Egrang'
  | 'Layangan'
  | 'Petak Umpet'
  | 'Congklak'
  | 'Bekel'
  | 'Gobak Sodor'
  | 'Kastara'
  | 'Energy'
export interface Card {
  id:string
  name:LocalText
  rarity:Rarity
  type:CardType
  sourceGame:SourceGame
  setCode:string
  rules:LocalText
  rationale:LocalText
  art:string|null
  stats:ReadonlyArray<{label:LocalText;value:number|string}>
  element?:Element|null
  hp?:number
  dmg?:number
  attackCost?:ReadonlyArray<Element|'any'>
}
export interface CardQuery { search:string; rarity:string; type:string; sourceGame:string; sort:'name'|'rarity'|'setCode' }
export const defaultCardQuery:CardQuery = {search:'', rarity:'all',type:'all',sourceGame:'all',sort:'setCode'}
export function queryCards(cards:readonly Card[], query:CardQuery, locale:Locale):Card[] { return cards.filter(card => (!query.search.trim() || card.name[locale].toLocaleLowerCase(locale).includes(query.search.trim().toLocaleLowerCase(locale))) && (query.rarity === 'all' || card.rarity === query.rarity) && (query.type === 'all' || card.type === query.type) && (query.sourceGame === 'all' || card.sourceGame === query.sourceGame)).sort((a,b) => { const ranks:Rarity[] = ['common','uncommon','rare','epic','secret']; const order = query.sort === 'rarity' ? ranks.indexOf(a.rarity)-ranks.indexOf(b.rarity) : (query.sort === 'setCode' ? a.setCode.localeCompare(b.setCode) : a.name[locale].localeCompare(b.name[locale], locale)); return order || a.id.localeCompare(b.id) }) }
