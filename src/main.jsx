import React from 'react'
import ReactDOM from 'react-dom/client'
import { appRouter } from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import appStore from './Store/appStore.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './Contexts/authContext.jsx'
import { ThemeProvider } from './Contexts/themeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Provider store={appStore}>
          <RouterProvider router={appRouter}>
          </RouterProvider>
        </Provider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)
