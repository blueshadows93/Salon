// stock.js
const stock = { fohn: 10, callos: 10 };

// Variables de los inputs
const nombreCliente = document.getElementById('nombre');
const cantidadFohn = document.getElementById('cantidad-fohn');
const cantidadCallos = document.getElementById('cantidad-callos');
const subtotalEl = document.getElementById('subtotal');
const btnPagar = document.getElementById('btn-pagar');
const btnWhatsapp = document.getElementById('btn-whatsapp');

// Actualizar subtotal
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

  if (!nombre) { alert("Escribe tu nombre"); return; }
  if (fohn===0 && callos===0) { alert("Selecciona al menos un producto"); return; }

  let mensaje = `Hola, soy ${nombre}, quiero comprar:%0A`;
  if (fohn>0) mensaje += `${fohn} Föhn (Secador de Pelo)%0A`;
  if (callos>0) mensaje += `${callos} Máquina Quita Callos%0A`;
  const total = (fohn*60)+(callos*30);
  mensaje += `Total: ${total}€`;

  window.open(`https://wa.me/31630779939?text=${mensaje}`, '_blank');
});

// Botón SumUp
btnPagar.addEventListener('click', async () => {
  const nombre = nombreCliente.value.trim();
  const subtotal = (parseInt(cantidadFohn.value)||0)*60 + (parseInt(cantidadCallos.value)||0)*30;

  if (!nombre) { alert("Escribe tu nombre"); return; }
  if (subtotal <= 0) { alert("Selecciona al menos un producto"); return; }

  try {
    const res = await fetch('http://localhost:3000/crear-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, subtotal })
    });

    const data = await res.json();

    if (data.checkoutLink) {
      window.open(data.checkoutLink, '_blank');
    } else {
      alert("Error generando el pago");
      console.error(data);
    }
  } catch(err) {
    console.error(err);
    alert("Error conectando con el servidor");
  }
});
