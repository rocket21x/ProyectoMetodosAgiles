import BusinessList from "./pages/BusinessList"
import BusinessCreate from "./pages/CreateBusiness"
import ExperienceCreate from "./pages/ExperienceCreate"
import "./App.css"

function App() {
  const pathname = window.location.pathname

  // Routing manual según URL
  if (pathname === "/registrar-negocio") {
    return <BusinessCreate />
  }

  if (pathname === "/experiencia") {
    return <ExperienceCreate />
  }

  // Página por defecto
  return <BusinessList />
}

export default App