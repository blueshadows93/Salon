// stock.js
const stock = { fohn: 10, callos: 10 };

// Variables de los inputs
const nombreCliente = document.getElementById('nombre');
const cantidadFohn = document.getElementById('cantidad-fohn');
const cantidadCallos = document.getElementById('cantidad-callos');

const btnPagar = document.getElementById('btn-pagar');

btnPagar.addEventListener('click', async () => {
  const nombre = nombreCliente.value.trim();
  const fohn = parseInt(cantidadFohn.value) || 0;
  const callos = parseInt(cantidadCallos.value) || 0;
  const subtotal = (fohn * 60) + (callos * 30);

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
