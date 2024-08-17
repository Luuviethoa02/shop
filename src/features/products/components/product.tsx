import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { productRespose } from "@/types/api"
import { Link } from "react-router-dom"

interface Iprops {
  product: productRespose
}

function Product({ product }: Iprops) {
  const { formatNumberToVND } = useFormatNumberToVND()

  const { brand_id, slug, _id, colors, name, price } = product
  return (
    <div className="lg:w-1/4 md:w-1/2 p-4 w-full">
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          20% OFF
        </div>
        <Link to={`product/${slug}`} className="block">
          <img
            src={colors[0]?.image || ""}
            alt={`this is image ${colors[0].name}`}
            width={500}
            height={500}
            className="w-full max-h-44 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            style={{ aspectRatio: "500/500", objectFit: "cover" }}
          />
        </Link>
        <div className="p-4 bg-background">
          <h5 className="text-base font-semibold line-clamp-3">{name}</h5>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">{formatNumberToVND(price)}</p>
              <p className="text-sm text-muted-foreground line-through">
                $124.99
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <ShoppingBagIcon className="mr-1 inline-block w-4 h-4" />
              1,234 sold
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShoppingBagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export default Product
