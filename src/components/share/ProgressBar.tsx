import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom" // not needed for nextjs
import nprogress from "nprogress"
import { useEffect, useState } from "react"
import useMounted from "@/hooks/useMounted"

const ProgressBar = (props: any) => {
  props = {
    color: "red",
    height: "2px",
    spinner: "20px",
    ...props,
  }
  const mounted = useMounted()
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) {
      nprogress.start()
      setVisible(true)
    }
    if (visible) {
      nprogress.done()
      setVisible(false)
    }
    if (!visible && mounted) {
      setVisible(false)
      nprogress.done()
    }
    return () => {
      nprogress.done()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted])

  const styles = `
     #nprogress .bar {
        background: ${props.color};
        height: ${props.height};
     }
     #nprogress .peg {
        box-shadow: 0 0 10px ${props.color}, 0 0 5px ${props.color};
     }
     #nprogress .spinner-icon {
        width: ${props.spinner};
        height: ${props.spinner};
        border-top-color: ${props.color};
        border-left-color: ${props.color};
     }
  `

  return (
    <Helmet>
      <style>{styles}</style>
    </Helmet>
  )
}
export default ProgressBar
