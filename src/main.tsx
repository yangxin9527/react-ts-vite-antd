import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import './index.less'
import stores from './store'
import { renderRoutes } from 'react-router-config'
import routes from './routes'

ReactDOM.render(
  <React.StrictMode>
    <Provider stores={stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
