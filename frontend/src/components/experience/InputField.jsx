export default function InputField({ label, required, ...props }) {
    return (
      <div className="input-group">
        <label>
          {label} {required && "*"}
        </label>
        <input {...props} />
      </div>
    );
  }
  