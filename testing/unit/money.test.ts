import {expect,it} from 'vitest'
import {totalIdr} from '@/domain/money'
it('bounds positive integer IDR and quantity without unsafe totals',()=>{expect(totalIdr(12500,3)).toBe(37500);for(const [price,qty] of [[1,1.5],[0,1],[1,-1],[Number.MAX_SAFE_INTEGER,2],[NaN,1],[Infinity,1]]) expect(()=>totalIdr(price,qty)).toThrow(RangeError)})
