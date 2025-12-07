const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:3000"

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Get JWT token from localStorage
  getToken() {
    return localStorage.getItem("jwt_token")
  }

  // Set JWT token in localStorage
  setToken(token) {
    localStorage.setItem("jwt_token", token)
  }

  // Remove JWT token from localStorage
  removeToken() {
    localStorage.removeItem("jwt_token")
  }

  // Build headers with JWT token
  getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Handle API errors
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        success: false,
        message: "Error en la respuesta del servidor",
      }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // GET request
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(options.includeAuth !== false),
        ...options,
      })
      return this.handleResponse(response)
    } catch (error) {
      console.error("[v0] API GET Error:", error)
      throw error
    }
  }

  // POST request
  async post(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(options.includeAuth !== false),
        body: JSON.stringify(data),
        ...options,
      })
      return this.handleResponse(response)
    } catch (error) {
      console.error("[v0] API POST Error:", error)
      throw error
    }
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(options.includeAuth !== false),
        body: JSON.stringify(data),
        ...options,
      })
      return this.handleResponse(response)
    } catch (error) {
      console.error("[v0] API PUT Error:", error)
      throw error
    }
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(options.includeAuth !== false),
        ...options,
      })
      return this.handleResponse(response)
    } catch (error) {
      console.error("[v0] API DELETE Error:", error)
      throw error
    }
  }

  // POST with FormData (for file uploads)
  async postFormData(endpoint, formData, options = {}) {
    try {
      const headers = {}
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
        ...options,
      })
      return this.handleResponse(response)
    } catch (error) {
      console.error("[v0] API POST FormData Error:", error)
      throw error
    }
  }
}

export default new ApiClient()
