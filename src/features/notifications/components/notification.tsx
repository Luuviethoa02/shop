import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { XIcon } from "lucide-react"
import { Link } from "react-router-dom"

const Notification = () => {
  return (
    <div className="flex items-center gap-4 mb-3">
      <Avatar>
        <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">
          <Link to="#" className="hover:underline">
            Shadcn
          </Link>
          commented on your post
        </p>
        <p className="text-sm text-muted-foreground">2 hours ago</p>
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}

export default Notification
