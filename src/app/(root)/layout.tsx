import Navbar from '@/src/components/navigation/navbar'
import React from 'react'
import { ReactNode } from 'react'

const RootLayout = ({children } :{children :ReactNode}) => {
  return (
    <main>
        <Navbar />
        {children}
    </main>
  )
}

export default RootLayout