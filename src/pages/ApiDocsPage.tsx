import {lazy,Suspense,Component,type ReactNode} from 'react'
import {useCopy} from '@/i18n/use-copy'
const Viewer=import.meta.env.DEV?lazy(()=>import('./SwaggerViewer')):null
class ViewerBoundary extends Component<{children:ReactNode;message:string},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<p role="alert">{this.props.message}</p>:this.props.children}}
export function ApiDocsPage(){const {t}=useCopy();return <div className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] api-page"><h1>{t('apiDocs')}</h1><div className="draft-notice"><strong>{t('draft')}</strong><p>{t('apiCopy')}</p><p>{t('apiSchemaEnglish')}</p></div>{Viewer?<ViewerBoundary message={t('apiError')}><Suspense fallback={<p role="status">{t('loading')}</p>}><Viewer/></Suspense></ViewerBoundary>:<p>{t('apiDevOnly')}</p>}</div>}
