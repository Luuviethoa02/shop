import { toZonedTime } from "date-fns-tz"
import { format } from "date-fns"

export default function useFormatDateVN() {
  const formatDate = (dateString: any) => {
    if (!dateString) {
      return ""
    }
    const vietnamTimeZone = "Asia/Ho_Chi_Minh"

    try {
      const utcDate = new Date(dateString as unknown as string)
      const zonedDate = toZonedTime(utcDate, vietnamTimeZone)
      return format(zonedDate, "dd/MM/yyyy HH:mm:ss")
    } catch (error) {
      console.error("Invalid date format:", error)
      return ""
    }
  }

  return { formatDate }
}
