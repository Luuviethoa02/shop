import { QueryClient } from "@tanstack/react-query"
import { createBrowserRouter } from "react-router-dom"
import { AdminLayout, MainLayout, SellerLayout } from "@/components/layouts"
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
      path: "/seller",
      element: <SellerLayout />,
      children: [
        {
          path: "",
          lazy: async () => {
            const { DashboardRoute } = await import("./seller/dashboard")
            return { Component: DashboardRoute }
          },
        },

        {
          path: "dashboard",
          lazy: async () => {
            const { DashboardRoute } = await import("./seller/dashboard")
            return { Component: DashboardRoute }
          },
        },
        {
          path: "oders",
          lazy: async () => {
            const { OderRoute } = await import("./seller/oder")
            return { Component: OderRoute }
          },
        },
        {
          path: "products",
          lazy: async () => {
            const { ProductRoute } = await import("./seller/product")
            return { Component: ProductRoute }
          },
        },
        {
          path: "stocks",
          lazy: async () => {
            const { StockRoute } = await import("./seller/stock")
            return { Component: StockRoute }
          },
        },
        {
          path: "customers",
          lazy: async () => {
            const { CustomerRoute } = await import("./seller/customer")
            return { Component: CustomerRoute }
          },
        },
        {
          path: "analytics",
          lazy: async () => {
            const { AnalysticRoute } = await import("./seller/analystic")
            return { Component: AnalysticRoute }
          },
        },
        {
          path: "profile",
          lazy: async () => {
            const { ProfileRoute } = await import("./seller/profile")
            return { Component: ProfileRoute }
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
          path: "category/:slug",
          lazy: async () => {
            const { CategoriesRoute } = await import("./products/categories")
            return { Component: CategoriesRoute }
          },
        },
        {
          path: "carts",
          lazy: async () => {
            const { CartRoutes } = await import("./products/carts")
            return { Component: CartRoutes }
          },
        },
        {
          path: "checkout",
          lazy: async () => {
            const { CheckoutRoute } = await import("./products/checkout")
            return {
              Component: () => (
                <ProtectedRoute>
                  <CheckoutRoute />
                </ProtectedRoute>
              ),
            }
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
      path: "auth/forgot-password",
      lazy: async () => {
        const { ForgotPasswordRoute } = await import("./auth/forgot-password")
        return { Component: ForgotPasswordRoute }
      },
    },
    {
      path: "auth/authenticate/:userId",
      lazy: async () => {
        const { AuthenticationRoute } = await import("./auth/authentication")
        return { Component: AuthenticationRoute }
      },
    },
    {
      path: "/forbidden",
      lazy: async () => {
        const { ForbiddenRoute } = await import("./forbidden")
        return { Component: ForbiddenRoute }
      },
    },
    {
      path: "auth/seller/register",
      lazy: async () => {
        const { RegisterRoute } = await import("./seller/register")
        return { Component: RegisterRoute }
      },
    },
    {
      path: "auth/seller/waiting",
      lazy: async () => {
        const { WaitingRoute } = await import("./seller/waiting")
        return { Component: WaitingRoute }
      },
    },
  ])
