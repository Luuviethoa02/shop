import { InfiniteMovingCards } from "@/components/share/infinite-moving-cards"
const ShopsList = () => {
  return (
    <>
      <h2 className="border-b text-gray-600 max-sm:text-center pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Shop nhiều người quan tâm
      </h2>
      <InfiniteMovingCards speed="normal" />
    </>
  )
}

export default ShopsList
