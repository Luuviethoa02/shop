import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

const formatDateVN = (dateString: any) => {
  if (!dateString) {
    return ""
  }

  const formattedTime = formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: vi,
  })

  return formattedTime
}

export { formatDateVN }
