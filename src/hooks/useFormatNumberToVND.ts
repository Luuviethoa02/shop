export default function useFormatNumberToVND() {
  const formatNumberToVND = (price: any) => {
    const number = price as unknown as number
    if (!number) {
      return ""
    }
    return (
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(number) || 0
    )
  }

  return { formatNumberToVND }
}
