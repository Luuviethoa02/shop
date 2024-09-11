import { HelmetProvider } from "react-helmet-async"
import { AuthLoader } from "@/lib/auth"
import { QueryClientProvider } from "@tanstack/react-query"
import React, { Suspense } from "react"
import { Toaster } from "react-hot-toast"
import { queryClient } from "@/lib/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import MainError from "@/components/errors/main.error"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { PrimeReactProvider } from "primereact/api"
import { env } from "@/config/env"
import LoadingMain from "@/components/share/LoadingMain"

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <GoogleOAuthProvider clientId={env.CLIENT_ID}>
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingMain />
          </div>
        }
      >
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <AuthLoader
              renderError={(error) => <MainError error={error} />}
              renderLoading={() => (
                <div className="flex h-screen w-screen items-center justify-center">
                  <LoadingMain />
                </div>
              )}
            >
              <PrimeReactProvider>{children}</PrimeReactProvider>
              <Toaster />
              <ReactQueryDevtools position="bottom" initialIsOpen={true} />
            </AuthLoader>
          </HelmetProvider>
        </QueryClientProvider>
      </Suspense>
    </GoogleOAuthProvider>
  )
}
