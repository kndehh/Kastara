import {useState} from 'react'
import {QueryClientProvider} from '@tanstack/react-query'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import {createQueryClient} from '@/lib/query-client'
import {getRoutes} from '@/router'
export default function App(){const [queryClient]=useState(createQueryClient);const [router]=useState(()=>createBrowserRouter(getRoutes()));return <QueryClientProvider client={queryClient}><RouterProvider router={router}/></QueryClientProvider>}
