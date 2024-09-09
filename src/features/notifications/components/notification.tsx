import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useDetailProduct } from "@/features/products/api/get-detailProduct"
import { getInitials } from "@/lib/utils"
import { Notification as NotificationType } from "@/types/client"
import { formatDateVN } from "@/utils"
import { XIcon } from "lucide-react"
import nProgress from "nprogress"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface Ipoprs {
  notifi: NotificationType
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Notification = ({ notifi, setIsNotificationOpen }: Ipoprs) => {
  const { _id, comment, notifications, createdAt, productId, rating } = notifi
  const navigate = useNavigate()
  const [slug, setSlug] = useState<string | undefined>(undefined)
  const { data: response, error } = useDetailProduct({ slug: productId.slug })

  const handleClickLink = (slug: string) => {
    setSlug(slug)
    setIsNotificationOpen(false)
  }

  useEffect(() => {
    if (response && slug) {
      navigate(`/product/${slug}?commentId=${_id}`, { state: { response } })
      nProgress.done()
    }
    if (error) {
      console.error("Failed to load product detail:", error)
      nProgress.done()
    }
  }, [response, error, slug])

  useEffect(() => {
    if (slug) {
      nProgress.start()
    }
  }, [slug])

  return (
    <div
      className="cursor-pointer p-1 rounded-lg hover:bg-destructive-foreground"
      onClick={() => handleClickLink(productId.slug)}
    >
      <div className="flex items-start gap-4 mb-3">
        <Link to={"/"}>
          <Avatar className="size-12 border">
            <AvatarImage
              src={notifications[0]?.notifiedUserId?.img}
              alt={notifications[0]?.notifiedUserId?.username}
            />
            <AvatarFallback>
              {" "}
              {getInitials(notifications[0]?.notifiedUserId?.username)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 space-y-1">
          <p className="text-sm">
            {notifications.map((user) => (
              <Link
                to="#"
                key={user._id}
                className="hover:underline font-medium text-base"
              >
                {user?.notifiedUserId?.username + " "}
              </Link>
            ))}
            cũng đã bình luận về sản phẩm{" "}
            <p className="font-medium">{productId?.name}</p>
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDateVN(notifications[0].createdAt)}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Notification
