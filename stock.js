// stock.js
// Stock disponible de cada producto
const stock = {
  fohn: 10,          // Föhn disponibles
  callos: 10,        // Máquinas quita callos
  resfridol: 10,     // Resfridol (paquete de 2 sobres)
  tubi: 5            // Tubi disponibles
};

// Precios de los productos
const precios = {
  fohn: 60,
  callos: 30,
  resfridol: 5,      // Precio por 2 sobres de Resfridol
  tubi: 20
};

const nombreCliente = document.getElementById('nombre');
const subtotalEl = document.getElementById('subtotal');

// Inputs de cantidades
const inputs = {
  fohn: document.getElementById('cantidad-fohn'),
  callos: document.getElementById('cantidad-callos'),
  resfridol: document.getElementById('cantidad-resfridol'),
  tubi: document.getElementById('cantidad-tubi')
};

// Mostrar stock disponible en la página
document.getElementById('stock-fohn').textContent = `Disponibles: ${stock.fohn}`;
document.getElementById('stock-callos').textContent = `Disponibles: ${stock.callos}`;
document.getElementById('stock-resfridol').textContent = `Disponibles: ${stock.resfridol}`;
document.getElementById('stock-tubi').textContent = `Disponibles: ${stock.tubi}`;

// Función para calcular subtotal
function calcularSubtotal() {
  let subtotal = 0;
  for (const producto in inputs) {
    const cantidad = parseInt(inputs[producto].value) || 0;
    subtotal += cantidad * precios[producto];
  }
  subtotalEl.textContent = `Subtotal: ${subtotal} €`;
  return subtotal;
}

// Escuchar cambios en inputs para actualizar subtotal
for (const producto in inputs) {
  inputs[producto].addEventListener('input', calcularSubtotal);
}

// Botón WhatsApp
document.getElementById('btn-whatsapp').addEventListener('click', () => {
  const nombre = nombreCliente.value.trim();
  if (!nombre) { alert("Escribe tu nombre"); return; }

  let mensaje = `Hola, soy ${nombre} y quiero pedir:\n`;
  let hayProductos = false;

  for (const producto in inputs) {
    const cantidad = parseInt(inputs[producto].value) || 0;
    if (cantidad > 0) {
      mensaje += `- ${cantidad} ${producto}\n`;
      hayProductos = true;
    }
  }

  if (!hayProductos) { alert("Selecciona al menos un producto"); return; }

  mensaje += `\n${subtotalEl.textContent}`;

  const telefono = "TU_NUMERO"; // <-- pon aquí tu número de WhatsApp con código de país
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
});

// PayPal
paypal.Buttons({
  createOrder: (data, actions) => {
    const total = calcularSubtotal();
    if (total <= 0) {
      alert("Selecciona al menos un producto");
      return;
    }
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toString(),
          currency_code: "EUR"
        }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert(`Pago completado por ${details.payer.name.given_name}`);
    });
  }
}).render('#paypal-button-container');
