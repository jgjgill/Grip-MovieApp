import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.scss'
import Routes from './routes'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  <Routes />
  // </React.StrictMode>
)

reportWebVitals()
