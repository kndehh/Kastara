import {expect,it} from 'vitest'
import {queryCards,defaultCardQuery} from '@/domain/cards'
import {cards} from '../fixtures/cards'
it('combines search, rarity, type and source with AND semantics',()=>{expect(queryCards(cards,{...defaultCardQuery,search:'beta',rarity:'epic',type:'power_up',sourceGame:'Gundu'},'id').map(c=>c.id)).toEqual(['test-b'])})
it.each(['name','rarity','setCode'] as const)('sorts %s without mutating input and uses ID tie-breakers',sort=>{const before=cards.map(c=>c.id);expect(queryCards(cards,{...defaultCardQuery,sort},'en').map(c=>c.id)).toEqual(['test-a','test-c','test-b']);expect(cards.map(c=>c.id)).toEqual(before)})
it('returns empty results for unmatched filters',()=>{expect(queryCards(cards,{...defaultCardQuery,rarity:'rare',sourceGame:'Gundu'},'id')).toEqual([])})
