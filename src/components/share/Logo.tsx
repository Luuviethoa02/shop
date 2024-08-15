import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

interface Iprops {
  className?: string
}
const Logo = ({ className }: Iprops) => {
  return (
    <Link to={"/"}>
      <div
        className={cn(`size-20 flex items-center justify-center`, className)}
      >
        <img src="/logo.png" alt="logo" />
      </div>
    </Link>
  )
}

export default Logo
