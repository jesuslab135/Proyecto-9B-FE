import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './components/ui/NavBar'
import Footer from './components/ui/Footer'

function App() {
  return (
    <>
    <NavBar/>
    <main>
      <Outlet />
    </main>
    <Footer/>
    </>
  )
}

export default App
