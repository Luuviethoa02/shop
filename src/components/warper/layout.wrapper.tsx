import React from 'react'

interface Iprops {
  children: React.ReactNode
}

const LayoutWapper = ({ children }: Iprops) => {
  return <div className="px-48">{children}</div>
}
export default LayoutWapper
