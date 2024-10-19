import { cn, getInitials } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { topSellers } from "@/types/api"
import { Badge } from "../ui/badge"
import { ChevronRight, Star, Users } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useNavigate } from "react-router-dom"
import { useGetShopBySlug } from "@/features/seller/api/get-shop-by-slug"
import nProgress from "nprogress"
import toast from "react-hot-toast"
import { useGetTopSellers } from "@/features/seller/api/get-top-shops"
import { useAuthStore } from "@/store"
import { Seller } from "@/types/client"

export const InfiniteMovingCards = ({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    addAnimation()
  }, [])
  const [start, setStart] = useState(false)
  const user = useAuthStore((state) => state.user)
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      if (topShops.status === "pending") {
        setStart(false)
      } else {
        setStart(true)
      }
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        )
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        )
      }
    }
  }
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s")
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s")
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s")
      }
    }
  }
  const topShops = useGetTopSellers({
    limit: 7,
  })
  const [slugShop, setSlugShop] = useState<string | undefined>()
  const getShop = useGetShopBySlug({ slug: slugShop })
  const navigate = useNavigate()
  useEffect(() => {
    if (slugShop) {
      nProgress.start()
    }
  }, [slugShop])

  useEffect(() => {
    if (getShop?.data) {
      navigate("/shop/" + slugShop)
      nProgress.done()
    }
    if (getShop?.error) {
      toast.error("Có lỗi xảy ra! thử lại sau.")
      nProgress.done()
    }
  }, [getShop, slugShop])

  const handleClickViewDetailShop = (slug: string) => {
    setSlugShop(slug)
  }

  useEffect(() => {
    if (topShops.status === "pending") {
      setStart(false)
    } else {
      setStart(true)
    }
  }, [topShops])

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {topShops?.status === "pending" ? (
          <>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className={`w-[350px] h-64 rounded-[8px] ${start ? "hidden" : undefined}`}
              />
            ))}
          </>
        ) : (
          <>
            {topShops?.data?.data
              .filter((shop) => shop._id !== (user?.sellerId as Seller)?._id)
              .map((item, idx) => (
                <Card key={item._id} className="w-[350px] overflow-hidden">
                  <div className="relative">
                    {item.img_cover && (
                      <img
                        src={item.img_cover}
                        alt="Shop background"
                        className="w-full h-28 object-cover"
                      />
                    )}
                    {!item.img_cover && (
                      <div className="w-full h-28 bg-slate-700" />
                    )}
                    <div
                      onClick={() => handleClickViewDetailShop(item.slug)}
                      className="absolute  -bottom-6 cursor-pointer left-4"
                    >
                      <Avatar className="size-12 bordrounded-full border">
                        <AvatarImage
                          className="size-full rounded-full object-cover"
                          src={item.logo}
                          alt={item.businessName}
                        />
                        <AvatarFallback>
                          {" "}
                          {getInitials(item.businessName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <CardContent className="pt-12 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.businessName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.city.split("-")[1]}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Users className="w-3 h-3" />
                        {(item.followers.length ?? 0).toLocaleString() +
                          " Quan tâm"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-medium">
                        {item.averageRating ?? 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </>
        )}
      </div>
    </div>
  )
}
