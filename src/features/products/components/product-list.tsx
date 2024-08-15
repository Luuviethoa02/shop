import React from "react"
import Product from "./product"
import LayoutWapper from "@/components/warper/layout.wrapper"

const ProductList = () => {
  return (
    <LayoutWapper>
      <section className="text-gray-600 body-font">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Danh sách sản phẩm
        </h2>
        <div className="container px-5 py-14 mx-auto">
          <div className="flex flex-wrap -m-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Product key={index} />
            ))}
          </div>
        </div>
      </section>
    </LayoutWapper>
  )
}

export default ProductList
