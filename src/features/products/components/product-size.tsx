import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Size } from "@/types/client"

interface Iprops {
  sizes: Size[]
}

export const SizeProduct = ({ sizes }: Iprops) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-lg"
    >
      <CarouselContent>
        {sizes.length === 0 && (
          <blockquote className="border-l-2 pl-4 italic">
            Hiện chưa có kích cỡ nào
          </blockquote>
        )}

        {sizes.length > 0 &&
          sizes.map((size, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-1  overflow-hidden">
                    <div className="flex items-center gap-2 px-[2px] py-1">
                      <div className="text-sm uppercase text-nowrap font-normal">
                        {`${size.name}<${size.weight}kg>`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      {sizes.length > 4 && (
        <>
          {" "}
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  )
}
