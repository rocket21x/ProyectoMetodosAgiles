export default function ImageUploader({ label }) {
    return (
      <div className="input-group">
        <label>{label} *</label>
  
        <div className="upload-box">
          <div className="upload-icon">☁️</div>
          <p>Arrastra la imagen aquí o haz click para seleccionar (.png, .jpg, .jpeg)</p>
          <button type="button" className="upload-btn">Seleccionar imagen</button>
        </div>
      </div>
    );
  }
  