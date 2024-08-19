import { QueryClient } from "@tanstack/react-query"
import { createBrowserRouter } from "react-router-dom"
import { AdminLayout, MainLayout } from "@/components/layouts"
import { ProtectedRoute } from "@/components/layouts/main.layout"

export const createRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "",
          lazy: async () => {
            const { DashboardRoute } = await import("./admin/dashboard")
            return { Component: DashboardRoute }
          },
        },
        {
          path: "dashboard",
          lazy: async () => {
            const { DashboardRoute } = await import("./admin/dashboard")
            return { Component: DashboardRoute }
          },
        },
        {
          path: "oders",
          lazy: async () => {
            const { OderRoute } = await import("./admin/oder")
            return { Component: OderRoute }
          },
        },
        {
          path: "products",
          lazy: async () => {
            const { ProductRoute } = await import("./admin/product")
            return { Component: ProductRoute }
          },
        },
        {
          path: "customers",
          lazy: async () => {
            const { CustomerRoute } = await import("./admin/customer")
            return { Component: CustomerRoute }
          },
        },
        {
          path: "analytics",
          lazy: async () => {
            const { AnalysticRoute } = await import("./admin/analystic")
            return { Component: AnalysticRoute }
          },
        },
        {
          path: "settings",
          lazy: async () => {
            const { SettingRoute } = await import("./admin/setting")
            return { Component: SettingRoute }
          },
        },
      ],
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "",
          lazy: async () => {
            const { LandingRoute } = await import("./landing")
            return { Component: LandingRoute }
          },
        },
        {
          path: "product/:slug",
          lazy: async () => {
            const { ProductDetailRoute } = await import(
              "./products/product-detail"
            )
            return { Component: ProductDetailRoute }
          },
        },
        {
          path: "/profile",
          lazy: async () => {
            const { ProfileRoute } = await import("./profile")
            return {
              Component: () => (
                <ProtectedRoute>
                  <ProfileRoute />
                </ProtectedRoute>
              ),
            }
          },
        },

        {
          path: "*",
          lazy: async () => {
            const { NotFoundRoute } = await import("./not-found")
            return { Component: NotFoundRoute }
          },
        },
      ],
    },
    {
      path: "auth/register",
      lazy: async () => {
        const { RegisterRoute } = await import("./auth/register")
        return { Component: RegisterRoute }
      },
    },
    {
      path: "auth/login",
      lazy: async () => {
        const { LoginRoute } = await import("./auth/login")
        return { Component: LoginRoute }
      },
    },
    {
      path: "/forbidden",
      lazy: async () => {
        const { ForbiddenRoute } = await import("./forbidden")
        return { Component: ForbiddenRoute }
      },
    },
  ])
