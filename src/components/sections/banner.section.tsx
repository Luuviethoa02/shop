import { Link } from "react-router-dom"

const Banner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0"></div>
      <div className="relative z-10 container mx-auto flex h-[80vh] flex-col items-center justify-center px-4 py-12 text-center md:px-6 lg:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          Nâng tầm phong cách của bạn một cách dễ dàng
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Khám phá sự kết hợp hoàn hảo giữa thời trang và chất lượng với bộ sưu
          tập trang phục cao cấp được tuyển chọn của chúng tôi.
        </p>
        <div className="mt-8">
          <Link
            to="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Mua bây giờ
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Banner
