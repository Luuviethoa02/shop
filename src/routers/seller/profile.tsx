import { Star, MapPin, Package, MessageCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const ProfileRoute = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Seller Profile */}
        <div className="md:col-span-1">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src="/placeholder.svg?height=192&width=384&text=Cover+Image"
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 -mt-12 border-4 border-background">
                  <AvatarImage
                    src="/placeholder.svg?height=96&width=96"
                    alt="Seller Avatar"
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">John Smith</h1>
                <p className="text-muted-foreground">Professional Seller</p>
                <div className="flex items-center mt-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">4.8</span>
                  <span className="ml-1 text-muted-foreground">
                    (120 reviews)
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="ml-1">New York, USA</span>
                </div>
                <div className="flex items-center mt-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="ml-1">50 Products</span>
                </div>
                <Button className="mt-4 w-full">
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products and Reviews */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[1, 2, 3, 4].map((product) => (
              <div
                key={product}
                className="bg-card text-card-foreground rounded-lg shadow p-4"
              >
                <img
                  src={`/placeholder.svg?height=200&width=300&text=Product+${product}`}
                  alt={`Product ${product}`}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold">Product Name {product}</h3>
                <p className="text-muted-foreground">$99.99</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">4.5</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    (30 reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div
                key={review}
                className="bg-card text-card-foreground rounded-lg shadow p-4"
              >
                <div className="flex items-center mb-2">
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=User+${review}`}
                      alt={`User ${review}`}
                    />
                    <AvatarFallback>U{review}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">User {review}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Great seller! The product was exactly as described and arrived
                  quickly. Highly recommended!
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
