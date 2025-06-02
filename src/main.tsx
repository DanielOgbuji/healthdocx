import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Supports weights 100-900
import App from './App.tsx'
import { Provider } from '@/components/ui/provider'
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <Toaster />
            <App />
        </Provider>
    </StrictMode>,
)
