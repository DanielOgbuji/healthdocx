import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Supports weights 100-900
import App from './App.tsx'
import { Provider } from '@/components/ui/provider'
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider>
                <Toaster />
                <App />
            </Provider>
        </QueryClientProvider>
    </StrictMode>,
)
