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
