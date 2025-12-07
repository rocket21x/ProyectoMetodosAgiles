import { Component } from "react";

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numeroTarjeta: "",
      fecha: "",
      cvv: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", this.state);
    // Aquí haces la petición al backend
  };

  render() {
    return (
      <form className="form-container" onSubmit={this.handleSubmit}>
        {/* Número de tarjeta */}
        <div className="input-group">
          <label>
            Número de tarjeta <span className="required">*</span>
          </label>
          <input
            type="text"
            name="numeroTarjeta"
            placeholder="1234 1234 1234 1234"
            value={this.state.numeroTarjeta}
            onChange={this.handleChange}
          />
        </div>

        {/* Fecha */}
        <div className="input-group">
          <label>
            Fecha de vencimiento <span className="required">*</span>
          </label>
          <input
            type="text"
            name="fecha"
            placeholder="MM-AA"
            value={this.state.fecha}
            onChange={this.handleChange}
          />
        </div>

        {/* CVV */}
        <div classname="input-group">
          <label>
            CVV <span className="required">*</span>
          </label>
          <input
            type="password"
            name="cvv"
            placeholder="123"
            maxLength="4"
            value={this.state.cvv}
            onChange={this.handleChange}
          />
        </div>

        {/* Botón */}
        <button type="submit" className="primary-btn">
          Pagar
        </button>
      </form>
    );
  }
}

export default PaymentForm;
