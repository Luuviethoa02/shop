import { useState } from "react"
import Product from "./product"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { LIMIT_PAE_PRODUCT_LIST } from "../constants"
import SekeletonList from "./sekeleton-list"
import { useProducts } from "@/features/products/api/get-products"

const ProductList = () => {
  const [page, setPage] = useState(1)

  const {
    data: productsApi,
    isLoading,
  } = useProducts({ page, limit: LIMIT_PAE_PRODUCT_LIST })

  return (
    <LayoutWapper>
      <section className="text-gray-600 body-font">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Danh sách sản phẩm
        </h2>
        <div className="container px-5 py-14 mx-auto">
          <div className="flex flex-wrap -m-4 gap-y-5">
            {isLoading  &&
              Array.from({ length: 8 }).map((_, index) => (
                <SekeletonList key={index} />
              ))}

            {productsApi?.data &&
              !isLoading &&
              productsApi?.data?.map((product, index) => (
                <Product product={product} key={index} />
              ))}
          </div>
        </div>
      </section>
    </LayoutWapper>
  )
}

export default ProductList
