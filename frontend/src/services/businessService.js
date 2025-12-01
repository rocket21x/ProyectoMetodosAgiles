import apiClient from "./apiClient"

class BusinessService {
  // Get all businesses for the current user
  async getUserBusinesses() {
    try {
      const response = await apiClient.get("/api/businesses")
      return response
    } catch (error) {
      console.error(" Error fetching businesses:", error)
      throw error
    }
  }

  // Create a new business
  async createBusiness(businessData) {
    try {
      // Transform frontend data to match API expected format
      const payload = {
        business_name: businessData.nombre,
        email: businessData.email,
        phone: businessData.telefono,
        active_state: businessData.estado === "Activo" ? "active" : "inactive",
        bank_clabe: businessData.cuentaBancaria || undefined,
      }

      const response = await apiClient.post("/api/businesses", payload)
      return response
    } catch (error) {
      console.error(" Error creating business:", error)
      throw error
    }
  }

  // Upload business logo (if you need this functionality later)
  async uploadBusinessLogo(businessId, file) {
    try {
      const formData = new FormData()
      formData.append("logo", file)

      const response = await apiClient.postFormData(`/api/businesses/${businessId}/logo`, formData)
      return response
    } catch (error) {
      console.error(" Error uploading logo:", error)
      throw error
    }
  }

  // Update business
  async updateBusiness(businessId, businessData) {
    try {
      const payload = {
        business_name: businessData.nombre,
        email: businessData.email,
        phone: businessData.telefono,
        active_state: businessData.estado === "Activo" ? "active" : "inactive",
        bank_clabe: businessData.cuentaBancaria || undefined,
      }

      const response = await apiClient.put(`/api/businesses/${businessId}`, payload)
      return response
    } catch (error) {
      console.error(" Error updating business:", error)
      throw error
    }
  }

  // Delete business
  async deleteBusiness(businessId) {
    try {
      const response = await apiClient.delete(`/api/businesses/${businessId}`)
      return response
    } catch (error) {
      console.error(" Error deleting business:", error)
      throw error
    }
  }
}

export default new BusinessService()
