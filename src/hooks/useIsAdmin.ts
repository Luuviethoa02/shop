import { useUser } from "@/lib/auth"

const useIsAdmin = (): boolean | null | undefined => {
  const { data } = useUser()
  return data && data.admin
}

export default useIsAdmin
