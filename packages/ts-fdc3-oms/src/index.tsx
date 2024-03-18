import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { setTheme } from './util/util'
import { attachGlueToGlobalScope } from './util/glue'
import GlueDesktop, { Glue42 } from '@glue42/desktop'
import GlueWeb from '@glue42/web'
import { GlueProvider } from '@glue42/react-hooks'
import Loader from './components/Loader'
import GlueWorkspace from '@glue42/workspaces-api'

import '@glue42/theme/dist/t42bootstrap.bundle.css'
import { customGDObject } from './util/glue'

if (window.glue42gd != null) {
    setTheme((window.glue42gd as customGDObject).theme)
}

const desktopConfig: Glue42.Config = {
    channels: true,
    libraries: [GlueWorkspace, attachGlueToGlobalScope],
    appManager: 'full',
}

const webConfig = {
    channels: true,
    libraries: [GlueWorkspace, attachGlueToGlobalScope],
}

const glueSettings = {
    web: {
        factory: GlueWeb,
        config: webConfig,
    },
    desktop: {
        factory: GlueDesktop,
        config: desktopConfig,
    },
}

window.glueIsConnecting = true

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <GlueProvider settings={glueSettings} fallback={<Loader />}>
        <StrictMode>
            <App />
        </StrictMode>
    </GlueProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
