import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface GlobalState {
  sellerCreated: boolean
  setSellerCreated: (value: boolean) => void
}

const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        sellerCreated: false,
        setSellerCreated: (value) =>
          set((state) => ({ ...state, sellerCreated: value })),
      }),
      { name: "sellerCreated" }
    )
  )
)

export default useGlobalStore
