import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

jest.mock('../services/apiClient', () => ({
  post: jest.fn(),
}))

import apiClient from '../services/apiClient'
import Login from '../pages/Login'

beforeEach(() => {
  localStorage.clear()
})

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login component', () => {
  it('renderiza el formulario de inicio de sesión', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('tiene un botón "Iniciar Sesión"', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument()
  })

  it('muestra error si se envía con campos vacíos', () => {
    renderLogin()
    const button = screen.getByRole('button', { name: 'Iniciar Sesión' })
    fireEvent.click(button)
    expect(screen.getByText('Todos los campos son obligatorios')).toBeInTheDocument()
  })

  it('deshabilita el botón durante el loading', () => {
    apiClient.post.mockImplementation(() => new Promise(() => {}))
    renderLogin()
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))
    expect(screen.getByRole('button', { name: 'Iniciando sesión...' })).toBeDisabled()
  })

  it('tiene enlace a registro', () => {
    renderLogin()
    expect(screen.getByText('Regístrate')).toBeInTheDocument()
    expect(screen.getByText('Regístrate').closest('a')).toHaveAttribute('href', '/registro')
  })
})
