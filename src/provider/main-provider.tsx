import { queryClient } from '@/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { Suspense } from 'react'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          {/* <Spinner size="xl" /> */}
          <h2>loading</h2>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Suspense>
  )
}
