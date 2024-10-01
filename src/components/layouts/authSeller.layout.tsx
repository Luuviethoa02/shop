import { useEffect } from "react"

interface Iprops {
  children: React.ReactNode
}

const AuthSellerLayout = ({ children }: Iprops) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return <div>{children}</div>
}

export default AuthSellerLayout
