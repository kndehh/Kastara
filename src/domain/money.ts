// Pure estimate arithmetic only. A future server must own actual payable totals.
export function totalIdr(unit:number,quantity:number):number {
 if(!Number.isSafeInteger(unit)||unit<1||!Number.isSafeInteger(quantity)||quantity<1||!Number.isSafeInteger(unit*quantity)) throw new RangeError('money.invalid')
 return unit*quantity
}
