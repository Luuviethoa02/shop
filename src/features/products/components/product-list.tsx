import { useState } from "react"
import Product from "./product"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { useProducts } from "../api/get-products"

const ProductList = () => {
  const [page, setPage] = useState(1)
  const limit = 4

  const { data: productsApi, status: statusGet } = useProducts({ page, limit })

  return (
    <LayoutWapper>
      <section className="text-gray-600 body-font">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Danh sách sản phẩm
        </h2>
        <div className="container px-5 py-14 mx-auto">
          <div className="flex flex-wrap -m-4">
            {productsApi?.data &&
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
