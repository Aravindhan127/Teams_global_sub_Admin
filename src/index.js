import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'

// ** Store Imports
import { store } from './redux/store/store'
import { Provider } from 'react-redux'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'

// ** Utils Imports
import { createEmotionCache } from './@core/utils/create-emotion-cache'

// ** Contexts
import { AuthProvider } from './context/AuthContext'
import { SettingsConsumer, SettingsProvider } from './@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Component Imports
import ThemeComponent from './@core/theme/ThemeComponent'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import "react-datepicker/dist/react-datepicker.css";

// ** Global css styles
import './styles/global.scss'

const emotionCache = createEmotionCache()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <BrowserRouter>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <AuthProvider>

                      <App />
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>

                    </AuthProvider>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </BrowserRouter>
      </CacheProvider>
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
