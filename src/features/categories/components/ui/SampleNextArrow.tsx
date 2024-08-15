import { cn } from "@/lib/utils"

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props
  return (
    <div
      className={cn(
        "hover:scale-150 flex items-center justify-center hover:-translate-y-1/2 transition-all duration-200",
        className
      )}
      onClick={onClick}
      style={{
        ...style,
        borderRadius: "50%",
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
        padding: "10px",
      }}
    />
  )
}

export default SampleNextArrow
