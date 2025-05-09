import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Display from './components/CheckoutPage'
import AdminPage from './components/AdminPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Display />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
