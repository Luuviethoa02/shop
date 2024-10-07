import { Link, Navigate } from "react-router-dom"
import LayoutWapper from "../warper/layout.wrapper"
import Logo from "../share/Logo"
import { Footer } from "../sections"
import Progress from "../share/Progress"
import ProgressBar from "../share/ProgressBar"
import { useEffect } from "react"

interface Iprops {
  children: React.ReactNode
  title?: string
}

const AuthLayout = ({ children, title }: Iprops) => {
  const user = !!localStorage.getItem("accessToken")
  if (user) {
    return <Navigate to={"/"} />
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="max-sm:p-5">
      <LayoutWapper>
        <ProgressBar />
        <div className="flex items-center justify-between gap">
          <div className="flex items-center gap-3">
            <Logo className="max-sm:hidden" />
            <h1 className="text-2xl ml-8 max-sm:ml-0 text-primary font-bold">
              {title}
            </h1>
          </div>
          <Link to={"/help"} className="text-red-400 hover:underline">
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </LayoutWapper>
      <div className="w-full lg:grid lg:min-h-[300px] lg:grid-cols-2 xl:min-h-[500px]">
        <div className="flex items-center justify-center py-2 max-sm:mt-7">
          <div className="mx-auto grid w-[350px] gap-6">{children}</div>
        </div>
        <div className="hidden max-h-[600px] bg-muted lg:block">
          <img
            src="/banner/banner_login_right.png"
            alt="Image"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AuthLayout
