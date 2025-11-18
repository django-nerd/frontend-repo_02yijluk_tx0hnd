import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { Login, Register } from './pages/Auth'
import Order from './pages/Order'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import TOS from './pages/TOS'
import ControlPanel from './pages/ControlPanel'

function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/control" element={<ControlPanel/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/order" element={<Order/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/payment" element={<Payment/>} />
      <Route path="/tos" element={<TOS/>} />
    </Routes>
  )
}

export default App
