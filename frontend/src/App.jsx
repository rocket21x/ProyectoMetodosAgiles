import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
// import Register from './pages/Register' 
import BusinessList from './pages/BusinessList'
import BusinessCreate from './pages/CreateBusiness'
import ExperienceCreate from './pages/ExperienceCreate'
import './App.css'

function App() {
  const token = localStorage.getItem('accessToken')

  // Rutas públicas
  const publicRoutes = (
    <>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/registro" element={<Register />} /> */}
    </>
  )

  // Rutas protegidas
  const protectedRoutes = (
    <>
      <Route path="/" element={<BusinessList />} />
      <Route path="/negocios" element={<BusinessList />} />
      <Route path="/registrar-negocio" element={<BusinessCreate />} />
      <Route path="/experiencia/crear" element={<ExperienceCreate />} />
    </>
  )

  return (
    <div className="app">
      {token && <Header />}
      <Routes>
        {publicRoutes}
        {token ? protectedRoutes : <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </div>
  )
}

export default App