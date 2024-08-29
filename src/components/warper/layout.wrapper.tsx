import React from "react"

interface Iprops {
  children: React.ReactNode
  size?: "small" | "medium" | "large"
}

const LayoutWapper = ({ children, size = "large" }: Iprops) => {
  return (
    <div
      className={`${size === "small" ? "px-24" : size === "medium" ? "px-32" : "px-48"}`}
    >
      {children}
    </div>
  )
}
export default LayoutWapper
