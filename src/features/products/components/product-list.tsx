import { useState, useEffect } from "react";
import Product from "./product";
import InfiniteScroll from 'react-infinite-scroll-component';
import { LIMIT_PAE_PRODUCT_LIST } from "../constants";
import SekeletonList from "./sekeleton-list";
import { useProducts } from "@/features/products/api/get-products";
import { productRespose } from "@/types/api";
import LoadingMain from "@/components/share/LoadingMain";

const limit = 4;
const maxPage = 4;

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<productRespose[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: productsApi, isLoading } = useProducts({
    page,
    limit
  });

  useEffect(() => {
    if (productsApi?.data) {
      setProducts((prevProducts) => [...prevProducts, ...productsApi.data]);
      if ((productsApi.data.length < LIMIT_PAE_PRODUCT_LIST) || (page >= maxPage)) {
        setHasMore(false);
      }
    }
  }, [productsApi]);

  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <section className="text-gray-600 body-font">
      <h2 className="border-b max-sm:text-center pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Danh sách sản phẩm
      </h2>
      <InfiniteScroll
        className="!overflow-hidden !min-w-full py-10 overflow-y-hidden"
        dataLength={products.length}
        next={loadMoreProducts}
        hasMore={hasMore}
        loader={<LoadingMain />}
      >
        <div className="flex flex-wrap gap-y-5">
          {isLoading && page === 1 &&
            Array.from({ length: 8 }).map((_, index) => (
              <SekeletonList key={index} />
            ))}

          {products.map((product, index) => (
            <Product product={product} key={index} />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default ProductList;