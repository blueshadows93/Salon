// Stock disponible
const stock = {
  fohn: 10,
  callos: 10
};

// Elementos del DOM
const cantidadFohn = document.getElementById('cantidad-fohn');
const cantidadCallos = document.getElementById('cantidad-callos');
const subtotalEl = document.getElementById('subtotal');
const nombreCliente = document.getElementById('nombre');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const stockFohnText = document.getElementById('stock-fohn');
const stockCallosText = document.getElementById('stock-callos');

// Función para actualizar stock visible y deshabilitar inputs si se agota
function actualizarStock() {
  // Föhn
  if(stock.fohn <= 0) {
    stockFohnText.textContent = "AGOTADO";
    stockFohnText.style.color = "red";
    cantidadFohn.value = 0;
    cantidadFohn.disabled = true;
  } else {
    stockFohnText.textContent = `${stock.fohn} unidades disponibles`;
    cantidadFohn.disabled = false;
    cantidadFohn.max = stock.fohn;
  }

  // Callos
  if(stock.callos <= 0) {
    stockCallosText.textContent = "AGOTADO";
    stockCallosText.style.color = "red";
    cantidadCallos.value = 0;
    cantidadCallos.disabled = true;
  } else {
    stockCallosText.textContent = `${stock.callos} unidades disponibles`;
    cantidadCallos.disabled = false;
    cantidadCallos.max = stock.callos;
  }
}

// Función para actualizar subtotal
function actualizarSubtotal() {
  const total = (parseInt(cantidadFohn.value)||0)*60 + (parseInt(cantidadCallos.value)||0)*30;
  subtotalEl.textContent = `Subtotal: ${total} €`;
}

function validarCantidad(input, max) {
  input.addEventListener('input', () => {
    let val = parseInt(input.value)||0;
    if(val < 0) input.value = 0;
    if(val > max) input.value = max;
    actualizarSubtotal();
  });
}

// Inicializar
actualizarStock();
actualizarSubtotal();
validarCantidad(cantidadFohn, stock.fohn);
validarCantidad(cantidadCallos, stock.callos);

// WhatsApp
btnWhatsapp.addEventListener('click', () => {
  const nombre = nombreCliente.value.trim();
  const fohn = parseInt(cantidadFohn.value)||0;
  const callos = parseInt(cantidadCallos.value)||0;
  const total = (fohn*60)+(callos*30);

  if(!nombre) { alert("Escribe tu nombre"); return; }
  if(total <= 0) { alert("Selecciona al menos un producto"); return; }

  let mensaje = `Hola, soy ${nombre}, quiero comprar:%0A`;
  if(fohn>0) mensaje += `${fohn} Föhn (Secador de Pelo)%0A`;
  if(callos>0) mensaje += `${callos} Máquina Quita Callos%0A`;
  mensaje += `Total: ${total}€`;

  window.open(`https://wa.me/31630779939?text=${mensaje}`, '_blank');
});

// PayPal Checkout dinámico
paypal.Buttons({
  createOrder: (data, actions) => {
    const fohn = parseInt(cantidadFohn.value)||0;
    const callos = parseInt(cantidadCallos.value)||0;
    const total = (fohn*60)+(callos*30);

    if(total <= 0){
      alert("Selecciona al menos un producto");
      return;
    }

    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toString()
        }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert(`Pago completado por ${details.payer.name.given_name}. ¡Gracias!`);
    });
  }
}).render('#paypal-button-container');
