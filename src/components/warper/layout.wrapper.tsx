import React from "react"
import { Header } from "../sections"

interface Iprops {
  children: React.ReactNode
  size?: "small" | "medium" | "large"
}

const LayoutWapper = ({ children, size = "large" }: Iprops) => {
  return (
    <>
      
      <div
        className={`${size === "small" ? "max-sm:px-2 md:px-24" : size === "medium" ? "max-sm:px-2 md:px-32" : "max-sm:px-2 md:px-48"}`}
      >
        {children}
      </div>
    </>
  )
}
export default LayoutWapper
