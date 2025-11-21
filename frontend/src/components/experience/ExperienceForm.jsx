import InputField from "./InputField";
import TextArea from "./TextArea";
import ImageUploader from "./ImageUploader";
import DaySelector from "./DaySelector";

export default function ExperienceForm() {
  return (
    <form>
      <InputField 
        label="Nombre de la experiencia" 
        required 
        placeholder="Ingrese el nombre de la experiencia" 
      />

      <TextArea 
        label="Descripción" 
        required 
        placeholder="Describe brevemente la experiencia (actividades, duracion, puntos importantes)." 
      />

      <div className="form-row">
        <div className="input-group">
          <label>
            Categoría *
          </label>
          <select className="select-field">
            <option value="">Categoría</option>
            <option value="aventura">Aventura</option>
            <option value="cultura">Cultura</option>
            <option value="gastronomia">Gastronomía</option>
            <option value="naturaleza">Naturaleza</option>
            <option value="deportes">Deportes</option>
          </select>
        </div>
        <InputField 
          label="Precio" 
          required 
          placeholder="$0.00" 
        />
      </div>

      <div className="form-row">
        <InputField 
          label="Precio por Persona (MXN)" 
          required 
          placeholder="$0.00" 
        />
        <InputField 
          label="Duración" 
          required 
          placeholder="Ej. 2 horas, 30 minutos" 
        />
      </div>

      <InputField 
        label="Ubicación" 
        required 
        placeholder="Ingrese la direccion o punto de encuentro" 
      />

      <ImageUploader label="Foto Principal de la Experiencia" />
      <ImageUploader label="Galería Opcional" />

      <div className="form-row">
        <div className="input-group">
          <label>
            Disponibilidad *
          </label>
          <DaySelector />
        </div>
        <InputField 
          label="Cupo Máximo" 
          required 
          placeholder="Numero maximo de personas" 
        />
      </div>

      <button type="button" className="submit-btn">Publicar Nueva Experiencia</button>
    </form>
  );
}
