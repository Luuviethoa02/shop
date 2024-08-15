import { Link } from "react-router-dom"

function Product() {
  return (
    <div className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer">
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          20% OFF
        </div>
        <Link to="#" className="block">
          <img
            src={
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Product Image"
            width={500}
            height={500}
            className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            style={{ aspectRatio: "500/500", objectFit: "cover" }}
          />
        </Link>
        <div className="p-4 bg-background">
          <h3 className="text-lg font-semibold">Acme Wireless Headphones</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">$99.99</p>
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
