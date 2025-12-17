import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from './components/common/Toast'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import ChatPage from './pages/Chat.page'
import LoginPage from './pages/Login.page'
import RegisterPage from './pages/Register.page'
import ProfilePage from './pages/Profile.page'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/' element={<ChatPage />} />
            <Route
              path='/chat/:conversationId'
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
          <ToastContainer />
        </>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  )
}