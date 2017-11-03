import * as nextRoutes from 'next-routes'
const routes = nextRoutes()
export default routes

routes.add('index', '/t/:contentId')
