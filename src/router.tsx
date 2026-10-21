import type {RouteObject} from 'react-router-dom'
import {Navigate} from 'react-router-dom'
import {Shell} from '@/components/Shell'
import {HomePage} from '@/pages/HomePage'
import {ConfirmationPage,PrivacyPage,NotFoundPage} from '@/pages/StatusPages'
import {ApiDocsPage} from '@/pages/ApiDocsPage'
import {ExperimentPage} from '@/pages/ExperimentPage'
import {CardsPage} from '@/pages/CardsPage'

export function getRoutes():RouteObject[]{
  return [
    {
      path:'/',
      element:<Shell/>,
      children:[
        {
          index:true,
          element:<HomePage/>,
        },
        {
          path:'kartu',
          element:<CardsPage/>,
        },
        {
          path:'experiment',
          element:<ExperimentPage/>,
        },
        {
          path:'privacy',
          element:<PrivacyPage/>,
        },
        {
          path:'order/:orderId',
          element:<ConfirmationPage/>,
        },
        {
          path:'api-docs',
          element:<ApiDocsPage/>,
        },
        {
          path:'paket',
          element:<Navigate to="/" state={{scrollTo:'paket'}} replace/>,
        },
        {
          path:'faq',
          element:<Navigate to="/" state={{scrollTo:'faq'}} replace/>,
        },
        {
          path:'about',
          element:<Navigate to="/" state={{scrollTo:'tentang'}} replace/>,
        },
        {
          path:'*',
          element:<NotFoundPage/>,
        },
      ],
    },
  ]
}
