import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
