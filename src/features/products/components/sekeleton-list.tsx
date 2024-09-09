import { Skeleton } from "@/components/ui/skeleton"

const SekeletonList = () => {
  return (
    <div className="p-4 lg:w-1/4 rounded-lg md:w-1/2 max-h-[320px] min-h-[320px]">
      <Skeleton className="min-w-full min-h-full"></Skeleton>
    </div>
  )
}

export default SekeletonList
