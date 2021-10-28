import loadable from '@loadable/component'
import Layout, { UserLayout } from '@/layouts'
// https://github.com/remix-run/react-router/tree/main/packages/react-router-config
import { RouteConfig } from 'react-router-config'

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        component: loadable(() => import('@/pages/home'))
      },
      {
        path: '/home',
        exact: true,
        component: loadable(() => import('@/pages/home'))
      },
      {
        path: '/login',
        exact: true,
        component: loadable(() => import('@/pages/login'))
      }
    ]
  },
  {
    path: '/user',
    exact: true,
    component: UserLayout,
    routes: [
      {
        path: '/',
        exact: false,
        component: loadable(() => import('@/pages/user-index'))
      }
    ]
  },
  {
    path: '*',
    component: loadable(() => import('@/pages/not-found'))
  }
]

export default routesConfig
