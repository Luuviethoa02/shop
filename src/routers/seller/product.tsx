import TableProduct from "@/features/products/components/table-product"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const ProductRoute = () => {
  return (
    <Tabs defaultValue="statusActive" className="w-full">
      <TabsList className="grid w-[300px] mb-10 grid-cols-2">
        <TabsTrigger value="statusActive">Tất cả sản phẩm</TabsTrigger>
        <TabsTrigger value="statusInActive">Thùng rác</TabsTrigger>
      </TabsList>
      <TabsContent value="statusActive">
        <TableProduct status={"active"} />
      </TabsContent>
      <TabsContent value="statusInActive">
        <TableProduct status={"inactive"} />
      </TabsContent>
    </Tabs>
  )
}
