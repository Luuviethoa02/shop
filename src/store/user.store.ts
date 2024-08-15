import { User } from "@/types/client"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface UserState {
  user: User | null | undefined
  setUser: (user: User) => void
}

const useAuthStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: { _id: "", username: "", email: "", img: "", admin: false },
        setUser: (user) => set((state) => ({ user: user })),
      }),
      { name: "AuthStore" }
    )
  )
)

export default useAuthStore
