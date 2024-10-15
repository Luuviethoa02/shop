import {
  getProductDetailQueryOptions,
  useDetailProduct,
} from "@/features/products/api/get-detailProduct"
import { ProductDetail } from "@/features/products/components/product-detail"
import { QueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

// export const productDetailLoader = (queryClient: QueryClient) => async () => {
//   const { slug } = useParams()
//   const query = getProductDetailQueryOptions(slug!);

//   return (
//     queryClient.getQueryData(query.queryKey) ??
//     (await queryClient.fetchQuery(query))
//   );
// };

export const ProductDetailRoute = () => {
  const { slug } = useParams()

  return (
    <ProductDetail
      slug={slug}
    />
  )
}
