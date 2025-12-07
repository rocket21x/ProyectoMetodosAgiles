"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import businessService from "../services/businessService"
import "../styles/business.css"

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBusinesses()
  }, [])

  const loadBusinesses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await businessService.getUserBusinesses()

      if (response.success) {
        setBusinesses(response.data || [])
      } else {
        setError(response.message || "Error al cargar los negocios")
      }
    } catch (err) {
      console.error(" Error loading businesses:", err)
      setError(err.message || "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBusiness = () => {
    window.location.href = "/registrar-negocio"
  }

  const handleMenuClick = (businessId) => {
    console.log(" Menú clicked para negocio:", businessId)
    // Aquí puedes agregar lógica para editar/eliminar
  }

  return (
    <div className="business-page">
      <Header />
      <div className="business-container">
        <div className="business-header">
          <h1>Mis Negocios</h1>
          <button className="add-business-btn" onClick={handleAddBusiness}>
            Agregar Nuevo Negocio
          </button>
        </div>

        <div className="business-table-card">
          <h2 className="table-title">Negocios Registrados</h2>

          {loading && (
            <div className="loading-state">
              <p>Cargando negocios...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={loadBusinesses} className="retry-btn">
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && businesses.length === 0 && (
            <div className="empty-state">
              <p>No hay negocios registrados</p>
              <button onClick={handleAddBusiness} className="add-business-btn">
                Agregar tu primer negocio
              </button>
            </div>
          )}

          {!loading && !error && businesses.length > 0 && (
            <div className="business-table">
              <div className="table-header">
                <div className="table-col">NOMBRE DEL NEGOCIO</div>
                <div className="table-col">ESTADO</div>
                <div className="table-col">ACCIONES</div>
              </div>

              <div className="table-body">
                {businesses.map((business) => (
                  <div key={business.id} className="table-row">
                    <div className="table-cell">{business.business_name}</div>
                    <div className="table-cell">
                      <span className={`status-badge ${business.active_state}`}>
                        {business.active_state === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="table-cell">
                      <button className="menu-btn" onClick={() => handleMenuClick(business.id)}>
                        ⋯
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
