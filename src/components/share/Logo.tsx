import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface Iprops {
  className?: string
}
const Logo = ({ className }: Iprops) => {
  const navigation = useNavigate()

  const handleClickBackHome = () => {
    navigation('/', { replace: true })
  }

  return (
    <div
      onClick={handleClickBackHome}
      className={cn(`size-20 cursor-pointer flex items-center justify-center`, className)}
    >
      <img className="block" src="/logo.png" alt="logo" />
      <blockquote className="text-primary pl-0 text-xl italic">
        Shopvh
      </blockquote>
    </div>
  )
}

export default Logo
