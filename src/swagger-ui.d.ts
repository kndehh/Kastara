// The upstream types describe the package root, but omit the browser subpath.
declare module 'swagger-ui-dist/swagger-ui-bundle' {
 import type {SwaggerUIBundle} from 'swagger-ui-dist'
 const bundle:SwaggerUIBundle
 export default bundle
}
