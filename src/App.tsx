import { useQueryClient } from "@tanstack/react-query"
import { RouterProvider } from "react-router-dom"
import { useMemo } from "react"
import nProgress from "nprogress"
import "../nprogress-setup"

import { createRouter } from "./routers"

import { AppProvider } from "./provider/main-provider"

import "./index.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

nProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 })

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
