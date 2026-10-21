import {expect,it} from 'vitest'
import {id,en,translate} from '@/i18n'
it('translates the requested locale with complete matching keys',()=>{expect(Object.keys(id)).toEqual(Object.keys(en));expect(translate('en','cards')).toBe('Cards')})
