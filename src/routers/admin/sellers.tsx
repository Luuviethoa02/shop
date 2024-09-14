import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EyeIcon, FilePenIcon } from "lucide-react"
import { useMemo, useState } from "react"

export const SellerRoute = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "John Doe",
      date: "2023-06-01",
      total: 99.99,
      status: "Pending",
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      date: "2023-06-02",
      total: 149.99,
      status: "Shipped",
    },
    {
      id: "ORD003",
      customer: "Bob Johnson",
      date: "2023-06-03",
      total: 79.99,
      status: "Delivered",
    },
    {
      id: "ORD004",
      customer: "Emily Davis",
      date: "2023-06-04",
      total: 199.99,
      status: "Cancelled",
    },
    {
      id: "ORD005",
      customer: "Michael Wilson",
      date: "2023-06-05",
      total: 129.99,
      status: "Pending",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const filteredOrders = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if ((a as any)[sortColumn] < (b as any)[sortColumn])
          return sortDirection === "asc" ? -1 : 1
        if ((a as any)[sortColumn] > (b as any)[sortColumn])
          return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [orders, searchTerm, sortColumn, sortDirection])
  const handleSort = (column: any) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort("id")}
          >
            Order #
            {sortColumn === "id" && (
              <span className="ml-2">
                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
              </span>
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort("customer")}
          >
            Customer
            {sortColumn === "customer" && (
              <span className="ml-2">
                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
              </span>
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort("date")}
          >
            Order Date
            {sortColumn === "date" && (
              <span className="ml-2">
                {sortDirection === "asc" ? "\u25B2" : "\u25BC"}
              </span>
            )}
          </TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell className="text-right">
              ${order.total.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={
                  order.status === "Pending"
                    ? "destructive"
                    : order.status === "Shipped"
                      ? "secondary"
                      : order.status === "Delivered"
                        ? "default"
                        : "outline"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="icon">
                <EyeIcon className="w-5 h-5" />
                <span className="sr-only">View Order</span>
              </Button>
              <Button variant="outline" size="icon" className="ml-2">
                <FilePenIcon className="w-5 h-5" />
                <span className="sr-only">Edit Order</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
