import { Link } from "react-router-dom"

const MainError = ({ error = "Lỗi không xác định" }: { error: unknown }) => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {`${error}`}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau hoặc
          liên hệ với bộ phận hỗ trợ nếu xảy ra sự cố vẫn tồn tại.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Thử lại
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainError
