import { useState, useEffect } from "react"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Thiết lập timer để delay cập nhật giá trị
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Xóa bỏ timer khi giá trị hoặc delay thay đổi hoặc khi component bị unmount
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
