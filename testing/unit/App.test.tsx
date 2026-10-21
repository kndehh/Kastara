import {render,screen} from '@testing-library/react'
import {it,expect} from 'vitest'
import App from '@/App'
it('renders the Kastara heading without credentials',async()=>{
  render(<App/>)
  expect(await screen.findByRole('heading',{name:'Kastara'})).toBeInTheDocument()
})
