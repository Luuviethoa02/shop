import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse, isBefore, isAfter, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generRateCartdId(
  productId: string,
  nameSize: string,
  colorId: string
): string {
  return `${productId}-${nameSize}-${colorId}`
}

export function getInitials(fullName: string) {
  // Chuyển tên thành chữ thường rồi tách thành mảng
  const names = fullName.toLowerCase().split(" ")

  // Lấy chữ cái đầu tiên của mỗi phần tử trong mảng và chuyển thành chữ hoa
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("")

  return initials.slice(0, 2)
}

export function getImageUrl(file: FileList | undefined): string | null {
  if (!file) return null

  return URL.createObjectURL(file[0])
}

export const getFormattedDate = (): string => {
  const now = new Date()

  // Hàm thêm hậu tố th, st, nd, rd vào ngày
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th" // Quy tắc chung cho ngày từ 4 đến 20
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  // Lấy ngày dưới dạng số
  const day = now.getDate()
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}` // Thêm hậu tố vào ngày

  // Định dạng phần còn lại của chuỗi ngày tháng
  const formattedDate = `${format(now, "MMMM")} ${dayWithSuffix}, ${format(now, "yyyy HH:mm:ss")}`

  return formattedDate
}

export const compareDates = (date1: string, date2: string): string => {
  // Định dạng ngày mong muốn
  const dateFormat = "MMMM do, yyyy HH:mm:ss"

  // Chuyển chuỗi ngày thành Date object
  const parsedDate1 = parse(date1, dateFormat, new Date())
  const parsedDate2 = parse(date2, dateFormat, new Date())

  if (isBefore(parsedDate1, parsedDate2)) {
    return `${format(parsedDate1, dateFormat)} is before ${format(parsedDate2, dateFormat)}`
  } else if (isAfter(parsedDate1, parsedDate2)) {
    return `${format(parsedDate1, dateFormat)} is after ${format(parsedDate2, dateFormat)}`
  } else {
    return `${format(parsedDate1, dateFormat)} is equal to ${format(parsedDate2, dateFormat)}`
  }
}

export const checkDateStatus = (
  startDate: string,
  endDate: string
): "active" | "inactive" | "expired" => {
  const dateFormat = "MMMM do, yyyy HH:mm:ss"
  const now = new Date() // Lấy thời gian hiện tại

  const parsedStartDate = parse(startDate, dateFormat, new Date())
  const parsedEndDate = parse(endDate, dateFormat, new Date())

  if (isBefore(now, parsedStartDate)) {
    // Nếu hiện tại nhỏ hơn startDate, trạng thái là 'inactive'
    return "inactive"
  } else if (isBefore(now, parsedEndDate) && isAfter(now, parsedStartDate)) {
    // Nếu hiện tại nằm giữa startDate và endDate, trạng thái là 'active'
    return "active"
  } else {
    // Nếu hiện tại lớn hơn endDate, trạng thái là 'expired'
    return "expired"
  }
}

export const calculatePercentage = (
  percentage: number,
  amount: string
): number => {
  const result = (percentage / 100) * Number(amount)
  return Number(amount) - result
}


export const formatDate = (isoDateString: string): string => {
  const date = parseISO(isoDateString);
  return format(date, 'dd/MM/yyyy');
};
