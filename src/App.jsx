import { useState } from 'react'
import './App.css'
import Header from "./components/header/header.jsx"
import HomePage from './pages/homepage/homePage.jsx'
import Footer from './components/footer/footer.jsx'


//Javascript
function App() {
  //javascript

  return (
    <div className="app">
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}

export default App
