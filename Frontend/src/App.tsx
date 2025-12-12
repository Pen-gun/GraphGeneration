import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient()


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <>
          <Routes>

          </Routes>
        </>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}