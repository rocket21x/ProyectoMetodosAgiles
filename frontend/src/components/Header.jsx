import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/header.css'

function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Localify</h1>
        </div>

        <nav className="nav">
          <ul>
            <li><a href="/">Mis Negocios</a></li>
            <li><a href="/registrar-negocio">Nuevo Negocio</a></li>
          </ul>
        </nav>

        <div className="user-menu">
          {user && (
            <>
              <span className="user-name">{user.first_name} {user.last_name}</span>
              <span className="user-role">{user.role}</span>
            </>
          )}
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header