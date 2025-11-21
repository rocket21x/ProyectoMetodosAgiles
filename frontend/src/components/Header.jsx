import "../styles/header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <div className="logo-icon">⛵</div>
          <span className="logo-text">Localify</span>
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">Mis negocios</a>
          <a href="#" className="nav-link">Perlas</a>
          <a href="#" className="nav-link">Negras</a>
          <a href="#" className="nav-link">Con redbull</a>
        </nav>
      </div>
    </header>
  );
}

