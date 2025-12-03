import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './components/UI/NavBar.jsx'
import Footer from './components/UI/Footer.jsx'

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
