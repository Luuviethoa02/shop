import { User } from "@/types/client"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface UserState {
  user: User | null | undefined
  setUser: (user: User) => void
  logout: () => void
}

const useAuthStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: {
          _id: "",
          sellerId: null,
          username: "",
          email: "",
          img: "",
          admin: false,
          loginGoogle: false,
        },
        setUser: (user) => set((state) => ({ ...state, user: user })),
        logout: () => set((state) => ({ ...state, user: undefined })),
      }),
      { name: "AuthStore" }
    )
  )
)

export default useAuthStore
