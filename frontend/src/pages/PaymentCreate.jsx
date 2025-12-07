import Header from "../components/Header";
import PaymentForm from "../components/payments/PaymentForm.jsx";
import "../styles/experience.css"; // Reutilizamos estilos como en ExperienceCreate

export default function PaymentCreate() {
  return (
    <div className="experience-page">
      <Header />
      <div className="experience-container">
        <h1>Procesar Pago</h1>
        <p className="subtitle">
          Complete el pago para finalizar la transacción
        </p>

        <div className="experience-card">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
}
