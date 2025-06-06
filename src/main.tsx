import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// tailwind样式放高一点，防止覆盖组件库的样式
import './styles/tailwind.css'
import App from './App.tsx'
import store from './store/store'

createRoot(document.getElementById('root')!)
.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
)
