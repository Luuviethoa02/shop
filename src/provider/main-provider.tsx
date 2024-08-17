import { HelmetProvider } from "react-helmet-async"
import { SpokeSpinner } from "@/components/ui/spinner"
import { AuthLoader } from "@/lib/auth"
import { QueryClientProvider } from "@tanstack/react-query"
import React, { Suspense } from "react"
import { Toaster } from "react-hot-toast"
import { queryClient } from "@/lib/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <SpokeSpinner size="xl" />
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthLoader
            renderError={(error) => (
              <div className="flex h-screen w-screen items-center justify-center">
                <div className="text-red-500">{"lỗi không xác đinh"}</div>
              </div>
            )}
            renderLoading={() => (
              <div className="flex h-screen w-screen items-center justify-center">
                <SpokeSpinner size="xl" />
              </div>
            )}
          >
            {children}
            <Toaster />
            <ReactQueryDevtools position="bottom" initialIsOpen={true} />
          </AuthLoader>
        </HelmetProvider>
      </QueryClientProvider>
    </Suspense>
  )
}
