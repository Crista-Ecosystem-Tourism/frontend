import { AppProvider } from '@/context/AppContext'
import { MainLayout } from '@/components/layout/MainLayout'

import { Routes, Route } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </AppProvider>
  )
}

export default App
