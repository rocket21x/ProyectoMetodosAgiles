"use client"

import { useState } from "react"
import Header from "../components/Header"
import businessService from "../services/businessService"
import "../styles/business.css"

export default function BusinessCreate() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    foto: null,
    estado: "Activo",
    cuentaBancaria: "",
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre del negocio es requerido")
      return false
    }
    if (!formData.email.trim()) {
      setError("El email es requerido")
      return false
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("El email no es válido")
      return false
    }
    if (!formData.telefono.trim()) {
      setError("El teléfono es requerido")
      return false
    }
    // CLABE validation (18 digits if provided)
    if (formData.cuentaBancaria && formData.cuentaBancaria.length !== 18) {
      setError("La CLABE bancaria debe tener 18 dígitos")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setError(null)
    setSuccessMessage(null)

    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      console.log(" Submitting business data:", formData)

      // Create business
      const response = await businessService.createBusiness(formData)

      if (response.success) {
        setSuccessMessage("¡Negocio registrado exitosamente!")
        console.log(" Business created:", response.data)

        // If there's a photo, upload it (optional for now)
        // if (formData.foto && response.data?.id) {
        //   await businessService.uploadBusinessLogo(response.data.id, formData.foto)
        // }

        // Redirect to business list after 2 seconds
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } else {
        setError(response.message || "Error al registrar el negocio")
      }
    } catch (err) {
      console.error(" Error creating business:", err)
      setError(err.message || "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="business-page">
      <Header />
      <div className="business-container">
        <div className="form-header">
          <h1>Registrar Nuevo Negocio</h1>
          <p className="subtitle">Complete la información a continuación para agregar un nuevo negocio</p>
        </div>

        {successMessage && <div className="success-message">✅ {successMessage}</div>}

        {error && <div className="error-message">❌ {error}</div>}

        <div className="business-form-card">
          <form onSubmit={handleSubmit}>
            {/* Nombre del Negocio */}
            <div className="input-group">
              <label>
                Nombre del Negocio <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingrese el nombre del negocio"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            {/* Email y Teléfono */}
            <div className="form-row">
              <div className="input-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@business.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label>
                  Teléfono <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="+1 (555) 000-0000"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Foto del negocio */}
            <div className="input-group">
              <label>
                Foto del negocio <span className="optional-label">(Opcional por ahora)</span>
              </label>
              <div className="upload-box">
                {preview ? (
                  <div className="image-preview">
                    <img src={preview || "/placeholder.svg"} alt="Preview" />
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">☁️</div>
                    <p>Arrastra la imagen aquí o haz click para seleccionar (.png, .jpg, .jpeg)</p>
                  </>
                )}
                <input
                  type="file"
                  id="foto"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={loading}
                />
                <label htmlFor="foto" className={`upload-btn ${loading ? "disabled" : ""}`}>
                  Seleccionar imagen
                </label>
              </div>
            </div>

            {/* Estado */}
            <div className="input-group">
              <label>
                Estado <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="estado"
                    value="Activo"
                    checked={formData.estado === "Activo"}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span>Activo</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="estado"
                    value="Inactivo"
                    checked={formData.estado === "Inactivo"}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span>Inactivo</span>
                </label>
              </div>
            </div>

            {/* Cuenta bancaria */}
            <div className="input-group">
              <label>
                Cuenta bancaria (CLABE) <span className="optional-label">(18 dígitos, opcional)</span>
              </label>
              <input
                type="text"
                name="cuentaBancaria"
                placeholder="Ingrese el número de cuenta bancaria"
                value={formData.cuentaBancaria}
                onChange={handleInputChange}
                maxLength={18}
                disabled={loading}
              />
            </div>

            {/* Botón de envío */}
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Negocio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
