import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'
import '../styles/login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.post('/api/auth/login', { email, password }, { includeAuth: false })

      if (response.success && response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/')
      } else {
        setError(response.message || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
