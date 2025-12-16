import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import HomePage from './pages/home.page.tsx'


const queryClient = new QueryClient()


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <>
          <Routes>
            <Route path='/' element={<HomePage/>} />
          </Routes>
        </>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}