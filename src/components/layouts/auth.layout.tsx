import { Link, Navigate } from "react-router-dom"
import LayoutWapper from "../warper/layout.wrapper"
import Logo from "../share/Logo"
import { Footer } from "../sections"
import Progress from "../share/Progress"

interface Iprops {
  children: React.ReactNode
  title?: string
}

const AuthLayout = ({ children, title }: Iprops) => {
  const user = !!localStorage.getItem("accessToken")
  if (user) {
    return <Navigate to={"/"} />
  }

  return (
    <div className="scrollbar-thumb-sky-700 scrollbar-track-sky-300">
      <Progress />
      <LayoutWapper>
        <div className="flex items-center justify-between gap">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-2xl text-primary font-bold">{title}</h1>
          </div>
          <Link to={"/help"} className="text-red-400 hover:underline">
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </LayoutWapper>
      <div className="w-full lg:grid lg:min-h-[300px] lg:grid-cols-2 xl:min-h-[500px]">
        <div className="flex items-center justify-center py-2">
          <div className="mx-auto grid w-[350px] gap-6">{children}</div>
        </div>
        <div className="hidden bg-muted lg:block">
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
