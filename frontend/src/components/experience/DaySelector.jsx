import { useState } from "react";

export default function DaySelector() {
  const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const [selected, setSelected] = useState([]);

  function toggleDay(day) {
    setSelected(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="day-selector">
      <p className="day-selector-label">Días de la Semana</p>

      <div className="day-list">
        {days.map(day => (
          <label key={day} className="day-checkbox">
            <input
              type="checkbox"
              checked={selected.includes(day)}
              onChange={() => toggleDay(day)}
            />
            <span>{day}</span>
          </label>
        ))}
      </div>

      <p className="selected-count">Días seleccionados: {selected.length}</p>
    </div>
  );
}
