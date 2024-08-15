import { Helmet } from "react-helmet-async"

interface Iprops {
  title: string
  description: string
  name?: string
  type?: string
}

function SEO({ title, description, name = "shop", type = "acticel" }: Iprops) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="shop:creator" content={name} />
      <meta property="og:type" content={type} />
    </Helmet>
  )
}

export default SEO
