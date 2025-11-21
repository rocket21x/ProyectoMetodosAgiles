export default function TextArea({ label, required, ...props }) {
    return (
      <div className="input-group">
        <label>
          {label} {required && "*"}
        </label>
        <textarea className="textarea" {...props}></textarea>
      </div>
    );
  }
  