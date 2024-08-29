import { useAuthStore } from "@/store"

const useIsAdmin = (): boolean | null | undefined => {
  const { user } = useAuthStore()
  return user && user.admin
}

export default useIsAdmin
