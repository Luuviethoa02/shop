import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Color } from "@/types/client"
import { X } from "lucide-react"

interface Iprops {
  colors: Color[]
  setColors: React.Dispatch<React.SetStateAction<Color[]>>
}

function getImageUrl(file: FileList | undefined): string | null {
  if (!file) return null

  return URL.createObjectURL(file[0])
}

export const ColorImage = ({ colors, setColors }: Iprops) => {
  const handleDelete = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index)
    setColors(newColors)
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-lg"
    >
      <CarouselContent>
        {colors.length === 0 && (
          <blockquote className="border-l-2 pl-4 italic">
            Hiện chưa có màu nào
          </blockquote>
        )}
        {colors.length > 0 &&
          colors.map((color, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-start p-1">
                    <div className="flex items-center gap-3 px-1 py-1">
                      <img
                        src={getImageUrl(color?.image) || ""}
                        alt="Avatar"
                        width="40"
                        height="40"
                        className="rounded-md"
                        style={{ aspectRatio: "40/40", objectFit: "cover" }}
                      />
                      <div className="text-sm font-normal">{color.name}</div>
                      <X
                        size={20}
                        className="cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      {colors.length > 3 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  )
}
