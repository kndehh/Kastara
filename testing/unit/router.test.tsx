import {render,screen} from '@testing-library/react'
import {createMemoryRouter,RouterProvider} from 'react-router-dom'
import {QueryClientProvider} from '@tanstack/react-query'
import {expect,it} from 'vitest'
import {getRoutes} from '@/router'
import {createQueryClient} from '@/lib/query-client'
it.each([['/privacy','Privasi pratinjau lokal'],['/order/TEST-PRIVATE','Konfirmasi belum bisa dibuka.'],['/missing','Halamannya nggak ketemu.'],['/api-docs','Dokumentasi API']])('renders %s with actual memory-history routing',async(path,title)=>{const queryClient=createQueryClient();const router=createMemoryRouter(getRoutes(),{initialEntries:[path]});render(<QueryClientProvider client={queryClient}><RouterProvider router={router}/></QueryClientProvider>);expect(await screen.findByRole('heading',{name:title})).toBeInTheDocument()})
