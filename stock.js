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
const btnPagar = document.getElementById('btn-pagar');

// Función para actualizar subtotal
function actualizarSubtotal() {
  const total = (parseInt(cantidadFohn.value)||0)*60 + (parseInt(cantidadCallos.value)||0)*30;
  subtotalEl.textContent = `Subtotal: ${total} €`;
}
cantidadFohn.addEventListener('input', actualizarSubtotal);
cantidadCallos.addEventListener('input', actualizarSubtotal);
actualizarSubtotal();

// Botón WhatsApp
btnWhatsapp.addEventListener('click', () => {
  const nombre = nombreCliente.value.trim();
  const fohn = parseInt(cantidadFohn.value)||0;
  const callos = parseInt(cantidadCallos.value)||0;
  const total = (fohn*60)+(callos*30);

  if (!nombre) { alert("Escribe tu nombre"); return; }
  if (total <= 0) { alert("Selecciona al menos un producto"); return; }

  let mensaje = `Hola, soy ${nombre}, quiero comprar:%0A`;
  if (fohn > 0) mensaje += `${fohn} Föhn (Secador de Pelo)%0A`;
  if (callos > 0) mensaje += `${callos} Máquina Quita Callos%0A`;
  mensaje += `Total: ${total}€`;

  btnWhatsapp.href = `https://wa.me/31630779939?text=${mensaje}`;
});

// Botón PayPal dinámico
btnPagar.addEventListener('click', () => {
  const nombre = nombreCliente.value.trim();
  const fohn = parseInt(cantidadFohn.value)||0;
  const callos = parseInt(cantidadCallos.value)||0;
  const total = (fohn*60)+(callos*30);

  if (!nombre) { alert("Escribe tu nombre"); return; }
  if (total <= 0) { alert("Selecciona al menos un producto"); return; }

  // Link PayPal dinámico
  const paypalLink = `https://www.paypal.me/robertcroes/${total}`;
  window.open(paypalLink, '_blank');
});
