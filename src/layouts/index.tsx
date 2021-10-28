import React from 'react'

import { RouteConfigComponentProps, renderRoutes } from 'react-router-config'
const Layout: React.FC<RouteConfigComponentProps> = React.memo(function Layout(props) {
  // const history = useHistory()
  const { route } = props
  return (
    <div>
      <h1>layout</h1>
      {renderRoutes(route?.routes)}
    </div>
  )
})
export const UserLayout: React.FC<RouteConfigComponentProps> = React.memo(function Layout(props) {
  // const history = useHistory()
  const { route } = props
  return (
    <div>
      <h1>user center</h1>
      {renderRoutes(route?.routes)}
    </div>
  )
})

export default Layout
