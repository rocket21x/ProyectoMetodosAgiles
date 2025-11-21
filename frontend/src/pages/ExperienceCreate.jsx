import Header from "../components/Header";
import ExperienceForm from "../components/experience/ExperienceForm.jsx";
import "../styles/experience.css";

export default function ExperienceCreate() {
  return (
    <div className="experience-page">
      <Header />
      <div className="experience-container">
        <h1>Experiencias Disponibles</h1>
        <p className="subtitle">Complete la información a continuación para agregar una nueva experiencia</p>

        <div className="experience-card">
          <ExperienceForm />
        </div>
      </div>
    </div>
  );
}
