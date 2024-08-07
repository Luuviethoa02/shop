import { Footer, Header } from "../sections"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return <>
    <Header />
    {children}
    <Footer />
  </>
}

export default MainLayout
