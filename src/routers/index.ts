import { QueryClient } from '@tanstack/react-query'
import { createBrowserRouter } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      lazy: async () => {
        const { LandingRoute } = await import('./landing')
        return { Component: LandingRoute }
      },
    },
    {
      path: '/auth/register',
      lazy: async () => {
        const { RegisterRoute } = await import('./auth/register')
        return { Component: RegisterRoute }
      },
    },
    {
      path: '/auth/login',
      lazy: async () => {
        const { LoginRoute } = await import('./auth/login')
        return { Component: LoginRoute }
      },
    },
    {
      path: '/admin',
      lazy: async () => {
        const { DashboardRoute } = await import('./admin/dashboard')
        return { Component: DashboardRoute }
      },
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./not-found')
        return { Component: NotFoundRoute }
      },
    },
  ])
