import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { productRespose } from "@/types/api"
import nProgress from "nprogress"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDetailProduct } from "../api/get-detailProduct"

interface Iprops {
  product: productRespose
}

function Product({ product }: Iprops) {
  const { formatNumberToVND } = useFormatNumberToVND()
  const navigate = useNavigate()
  const [slug, setSlug] = useState<string | undefined>(undefined)
  const { data: response, error } = useDetailProduct({ slug })

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
      console.error("Failed to load product detail:", error)
      nProgress.done()
    }
  }, [response, error, slug])

  const handleCardItemClick = (slug: string) => {
    setSlug(slug)
  }

  const { brand_id, slug: slugProduct, _id, colors, name, price } = product
  return (
    <div className="lg:w-1/4 md:w-1/2 p-4 w-full max-h-[320px] min-h-[320px]">
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          20% OFF
        </div>
        <div
          onClick={() => handleCardItemClick(slugProduct)}
          className="block cursor-pointer"
        >
          <img
            src={colors[0]?.image || ""}
            alt={`this is image ${colors[0].name}`}
            width={500}
            height={500}
            className="w-full max-h-44 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            style={{ aspectRatio: "500/500", objectFit: "cover" }}
          />
        </div>
        <div className="p-4 bg-background">
          <h5 className="text-base font-semibold line-clamp-3">{name}</h5>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">{formatNumberToVND(price)}</p>
              <p className="text-sm text-muted-foreground line-through">
                $124.99
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
