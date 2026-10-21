import {useEffect,useRef} from 'react'
import SwaggerUI from 'swagger-ui-dist/swagger-ui-bundle'
import 'swagger-ui-dist/swagger-ui.css'
// Standalone bundle isolates Swagger's React runtime from React 19 storefront.
export default function SwaggerViewer(){const root=useRef<HTMLDivElement>(null);useEffect(()=>{const element=root.current;if(!element)return;SwaggerUI({domNode:element,url:'/api/openapi.yaml',supportedSubmitMethods:[],tryItOutEnabled:false,validatorUrl:null,persistAuthorization:false,withCredentials:false,docExpansion:'list',defaultModelsExpandDepth:-1});return ()=>{element.replaceChildren()}},[]);return <div className="swagger-frame" lang="en"><div ref={root}/></div>}
