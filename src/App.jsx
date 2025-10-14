import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    {/* <NavBar/> */}
    <main>
      <Outlet />
    </main>
    {/* <Footer/> */}
    </>
  )
}

export default App
