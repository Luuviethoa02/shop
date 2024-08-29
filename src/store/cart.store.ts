import { CartItem } from "@/types/client"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface CartStore {
  carts: {
    [key: string]: CartItem
  }
  setCart: (cart: CartItem, id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  removeCart: (id: string) => void
}

const cartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        carts: {},
        setCart: (cart: CartItem, id: string) =>
          set((state) => ({
            carts: {
              ...state.carts,
              [id]: cart,
            },
          })),
        updateQuantity: (id: string, quantity: number) =>
          set((state) => ({
            carts: {
              ...state.carts,
              [id]: {
                ...state.carts[id],
                quantity,
              },
            },
          })),
        removeCart: (id: string) =>
          set((state) => {
            const newCarts = { ...state.carts }
            delete newCarts[id]
            return { carts: newCarts }
          }),
      }),
      { name: "CartStore" }
    )
  )
)

export default cartStore
