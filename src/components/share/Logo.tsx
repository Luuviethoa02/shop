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
        <img className="block" src="/logo.png" alt="logo" />
        <blockquote className="text-primary pl-0 text-xl italic">
          Shopvh
        </blockquote>
      </div>
    </Link>
  )
}

export default Logo
