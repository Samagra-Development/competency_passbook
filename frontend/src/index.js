import React from 'react'
import 'assets/css/App.css'
import theme from 'theme/theme'
import ReactDOM from 'react-dom'
import RTLLayout from 'layouts/rtl'
import AuthLayout from 'layouts/auth'
import AdminLayout from 'layouts/admin'
import { ChakraProvider } from '@chakra-ui/react'
import AlertTemplate from 'react-alert-template-basic'
import { Provider as AlertProvider } from 'react-alert'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'

const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <AlertProvider template={AlertTemplate} {...options}>
        <HashRouter>
          <Switch>
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/admin`} component={AdminLayout} />
            <Route path={`/rtl`} component={RTLLayout} />
            <Redirect from='/' to='/admin' />
          </Switch>
        </HashRouter>
      </AlertProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
)
