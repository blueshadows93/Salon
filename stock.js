// stock.js
// Cantidades disponibles
const stock = {
  fohn: 10,
  callos: 10,
  ampicilina: 10,
  tubi: 5
};

const cantidadFohn = document.getElementById('cantidad-fohn');
const cantidadCallos = document.getElementById('cantidad-callos');
const cantidadAmp = document.getElementById('cantidad-amp');
const cantidadTubi = document.getElementById('cantidad-tubi');
const stockFohnSpan = document.getElementById('stock-text-fohn');
const stockCallosSpan = document.getElementById('stock-text-callos');
const stockAmpSpan = document.getElementById('stock-text-amp');
const stockTubiSpan = document.getElementById('stock-text-tubi');
const nombreCliente = document.getElementById('nombre');
const subtotalEl = document.getElementById('subtotal');
const btnPedido = document.getElementById('btn-pedido');

let subtotal = 0;

// Recuperar nombre guardado
if (localStorage.getItem('nombreCliente')) {
  nombreCliente.value = localStorage.getItem('nombreCliente');
}

function aplicarStock(span, input, cantidad) {
  if (cantidad <= 0) {
    span.textContent = "AGOTADO";
    span.style.color = "red";
    input.value = 0;
    input.disabled = true;
    input.max = 0;
  } else {
    span.textContent = (cantidad === 1)
      ? "1 unidad disponible"
      : cantidad + " unidades disponibles";
    span.style.color = "#555";
    input.disabled = false;
    input.max = cantidad;
    input.addEventListener('input', () => {
      const n = parseInt(input.value) || 0;
      if (n > cantidad) input.value = cantidad;
      if (n < 0) input.value = 0;
      actualizarSubtotal();
    });
  }
}

function actualizarSubtotal() {
  const fohn = parseInt(cantidadFohn.value) || 0;
  const callos = parseInt(cantidadCallos.value) || 0;
  const amp = parseInt(cantidadAmp.value) || 0;
  const tubi = parseInt(cantidadTubi.value) || 0;

  subtotal = (fohn * 60) + (callos * 30) + (amp * 10) + (tubi * 5);
  subtotalEl.textContent = `Subtotal: ${subtotal} €`;
}

// Mostrar stock inicial
aplicarStock(stockFohnSpan, cantidadFohn, stock.fohn);
aplicarStock(stockCallosSpan, cantidadCallos, stock.callos);
aplicarStock(stockAmpSpan, cantidadAmp, stock.ampicilina);
aplicarStock(stockTubiSpan, cantidadTubi, stock.tubi);
actualizarSubtotal();

// Botón WhatsApp
btnPedido.addEventListener('click', () => {
  const fohn = parseInt(cantidadFohn.value) || 0;
  const callos = parseInt(cantidadCallos.value) || 0;
  const amp = parseInt(cantidadAmp.value) || 0;
  const tubi = parseInt(cantidadTubi.value) || 0;
  const nombre = nombreCliente.value.trim();

  if (!nombre) {
    alert("Por favor, escribe tu nombre y apellido.");
    return;
  }

  localStorage.setItem('nombreCliente', nombre);

  if (fohn === 0 && callos === 0 && amp === 0 && tubi === 0) {
    alert('Por favor, selecciona al menos un producto.');
    return;
  }

  let mensaje = `Hola, soy ${nombre}, quiero hacer el siguiente pedido:%0A`;
  if (fohn > 0) mensaje += `${fohn} Föhn (Secador de Pelo)%0A`;
  if (callos > 0) mensaje += `${callos} Máquina Quita Callos%0A`;
  if (amp > 0) mensaje += `${amp} sobres de Ampicilina%0A`;
  if (tubi > 0) mensaje += `${tubi} Tubi%0A`;
  mensaje += `Total: ${subtotal}€`;

  btnPedido.href = `https://wa.me/31630779939?text=${mensaje}`;
});

// Botón PayPal
if (typeof paypal !== "undefined") {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: subtotal.toString()
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Pago completado por ' + details.payer.name.given_name);
      });
    }
  }).render('#paypal-button-container');
}
