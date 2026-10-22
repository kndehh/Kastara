import {test,expect} from '@playwright/test'

test('local showcase has no credentials, network mutations or overflow',async({page})=>{
  const errors:string[]=[];const writes:string[]=[]
  page.on('pageerror',e=>errors.push(e.message))
  page.on('request',r=>{if(r.method()==='POST')writes.push(r.url())})
  await page.goto('/')
  await expect(page.getByRole('heading',{name:'Kastara',exact:true})).toBeVisible()
  await expect(page.getByRole('button',{name:'Belum ada'}).first()).toBeDisabled()
  await expect(page.getByRole('button',{name:'Waitlist belum aktif'})).toBeDisabled()
  for(const width of [360,390,768,1024,1440]){
    await page.setViewportSize({width,height:900})
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
  await page.getByRole('button',{name:'English'}).click()
  await expect(page.locator('html')).toHaveAttribute('lang','en')
  await expect(page.getByRole('heading',{name:'Kastara',exact:true})).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang','en')
  await page.goto('/privacy')
  await expect(page.getByRole('heading',{name:'Local preview privacy'})).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading',{name:'Kastara',exact:true})).toBeVisible()
  expect(errors).toEqual([])
  expect(writes).toEqual([])
})

test('mobile menu traps focus, supports Escape and restores focus',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  const trigger=page.getByRole('button',{name:'Buka menu'})
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.getByRole('dialog').getByRole('button',{name:'Kartu',exact:true}).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page).toHaveURL('/')
})

test('deep order route cannot reveal a confirmation from a public reference',async({page})=>{
  await page.goto('/order/TEST-PUBLIC?capability=do-not-use')
  await expect(page.getByRole('heading',{name:'Konfirmasi belum bisa dibuka.'})).toBeVisible()
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex,nofollow')
  await page.reload()
  await expect(page.getByText('Backend belum disetel')).toBeVisible()
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading',{name:'Halamannya nggak ketemu.'})).toBeVisible()
})

test('development API docs render the draft without execute controls',async({page})=>{
  await page.goto('/api-docs')
  await expect(page.getByText('Kontrak draf, endpoint belum diterapkan')).toBeVisible()
  await expect(page.locator('.swagger-ui')).toBeVisible({timeout:30000})
  await expect(page.locator('.opblock').first()).toBeVisible({timeout:30000})
  await page.locator('.opblock-summary').first().click()
  await expect(page.getByRole('button',{name:'Try it out'})).toHaveCount(0)
})
