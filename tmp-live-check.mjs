import {chromium} from '@playwright/test'

const base='http://127.0.0.1:5173'
const browser=await chromium.launch()
const page=await browser.newPage({viewport:{width:1440,height:1000}})
const errors=[]
page.on('pageerror',e=>errors.push(e.message))

await page.goto(`${base}/kartu`)
await page.waitForLoadState('networkidle')

// 1. Card dialog opens straight to full detail
await page.getByRole('button',{name:/Buka rincian kartu/}).first().click()
const dialog=page.getByRole('dialog')
await dialog.waitFor({state:'visible'})
const dialogText=await dialog.innerText()
console.log('--- DIALOG (first 1200 chars) ---')
console.log(dialogText.slice(0,1200))
const panels=await dialog.locator('.card-opener > div > div, .card-opener > div > div > div').count()
console.log('split panels found:',panels)
console.log('has stats panel:',await dialog.getByText('Statistik',{exact:true}).count())
console.log('has rules panel:',await dialog.getByText('Aturan',{exact:true}).count())
console.log('has 2-step button:',await dialog.getByRole('button',{name:/Lihat selengkapnya/}).count())
await page.screenshot({path:'tmp-shot-dialog.png'})
await page.keyboard.press('Escape')
await page.waitForTimeout(400)

// 2. Simulator glow/guide sync
await page.goto(`${base}/experiment`)
await page.waitForLoadState('networkidle')
await page.locator('#coba').scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
const guide=page.locator('#coba [role="status"]').first()
console.log('--- GUIDE TEXT ---')
console.log(await guide.innerText())
const hinted=page.locator('#coba [data-hint="true"]')
console.log('hinted count:',await hinted.count())
console.log('hinted text:',await hinted.allInnerTexts())
console.log('hinted aria:',await hinted.allInnerTexts())
await page.screenshot({path:'tmp-shot-sim-1.png'})

// click the hinted card
await hinted.first().click()
await page.waitForTimeout(700)
console.log('--- GUIDE TEXT 2 ---')
console.log(await guide.innerText())
const hinted2=page.locator('#coba [data-hint="true"]')
console.log('hinted count 2:',await hinted2.count())
console.log('hinted text 2:',await hinted2.allInnerTexts())
await page.screenshot({path:'tmp-shot-sim-2.png'})

// play through to a win/lose
for(let i=0;i<90;i++){
  const h=page.locator('#coba [data-hint="true"]')
  const n=await h.count()
  if(n===0){await page.waitForTimeout(300);console.log(i,'no hint');continue}
  const el=h.first()
  const txt=(await el.innerText()).replace(/\n/g,' | ')
  await el.click()
  await page.waitForTimeout(420)
  const banner=page.locator('[data-testid="sim-result-banner"]')
  console.log(i,'clicked:',txt,'| guide:',(await guide.innerText()).replace(/\n/g,' '),'| banner:',await banner.count())
  if(await banner.count()>0){
    console.log('--- BANNER after',i,'steps ---')
    console.log(await banner.innerText())
    await page.screenshot({path:'tmp-shot-sim-result.png'})
    break
  }
}

console.log('page errors:',errors)
await browser.close()
