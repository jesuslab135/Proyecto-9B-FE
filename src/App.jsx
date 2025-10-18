import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './components/UI/NavBar'
import Footer from './components/UI/Footer'

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
