import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { productRespose } from "@/types/api"
import nProgress from "nprogress"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDetailProduct } from "../api/get-detailProduct"
import { MapPin } from "lucide-react"
import { calculatePercentage } from "@/lib/utils"
import toast from "react-hot-toast"

interface Iprops {
  product: productRespose
}

function Product({ product }: Iprops) {
  const { formatNumberToVND } = useFormatNumberToVND()
  const navigate = useNavigate()
  const [slug, setSlug] = useState<string | undefined>(undefined)
  const { data: response, error } = useDetailProduct({
    slug,
    params: {
      pageCurrentShop: 1,
      pageSimilar: 1,
    },
  })

  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  const handleMouseEnter = (image: string) => {
    setHoveredImage(image)
  }

  const handleMouseLeave = () => {
    setHoveredImage(null)
  }

  useEffect(() => {
    if (slug) {
      nProgress.start()
    }
  }, [slug])

  useEffect(() => {
    if (response) {
      navigate(`/product/${slug}`, { state: { response } })
      nProgress.done()
    }
    if (error) {
      toast.error("Có lỗi xảy ra! thử lại sau!")
      nProgress.done()
    }
  }, [response, error, slug])

  const handleCardItemClick = (slug: string) => {
    setSlug(slug)
  }

  const {
    sellerId,
    discount,
    average_rating,
    total,
    slug: slugProduct,
    colors,
    name,
    price,
  } = product

  return (
    <div className="max-lg:w-1/2 mb-5 max-sm:w-full max-md:w-1/2 my-3 xl:w-1/4 p-4 w-full max-h-[370px] min-h-[370px]">
      <div className="relative w-full max-h-[370px] min-h-[370px] min-w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:border-primary border ease-in-out hover:shadow-xl hover:scale-105">
        {discount && discount.length > 0 && (
          <div className="absolute top-1 right-1 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            - {discount[0].discount_percentage}%
          </div>
        )}
        <div
          onClick={() => handleCardItemClick(slugProduct)}
          className="block min-w-full w-full cursor-pointer transition-all duration-300 ease-in-out"
          onMouseEnter={() => handleMouseEnter(colors[1]?.image || "")}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={hoveredImage || colors[0]?.image || ""}
            alt={`this is image ${colors[0].name}`}
            className="min-w-full max-h-44 min-h-44 object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
            style={{ aspectRatio: "500/500", objectFit: "cover" }}
          />
        </div>
        <div className="p-4 bg-background">
          <h5 className="text-base min-h-[72px] font-semibold line-clamp-3">
            {name}
          </h5>
          <div className="flex items-center justify-between w-full mt-1">
            {discount?.length === 0 && (
              <p className="text-lg block font-medium">
                {formatNumberToVND(price)}
              </p>
            )}
            {discount && discount.length > 0 && (
              <>
                <p className="text-lg block line-through font-medium">
                  {formatNumberToVND(price)}
                </p>
                <p className="text-lg text-destructive block font-medium">
                  {formatNumberToVND(
                    calculatePercentage(discount[0].discount_percentage, price)
                  )}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((i, j) => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={j < average_rating ? "#fde047" : "none"}
                  stroke="currentColor"
                  key={j}
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <p className="text-sm block capitalize font-normal text-muted-foreground">
              đã bán {total}
            </p>
          </div>
          <div className="flex items-center justify-between w-full mt-2">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <p className="text-sm block capitalize font-light text-muted-foreground">
                {sellerId?.city.split("-")[1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
