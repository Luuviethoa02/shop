import { useQueryClient } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { useMemo } from 'react'

import { createRouter } from './routers'

import './index.css'
import { AppProvider } from './provider/main-provider'

const AppRouter = () => {
  const queryClient = useQueryClient()

  const router = useMemo(() => createRouter(queryClient), [queryClient])

  return <RouterProvider router={router} />
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

export default App
