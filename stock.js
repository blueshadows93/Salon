// Stock disponible
const stock = { 
  fohn: 10, 
  callos: 10, 
  ampicilina: 10, 
  tubi: 5 
};

// Elementos
const cantidadFohn = document.getElementById('cantidad-fohn');
const cantidadCallos = document.getElementById('cantidad-callos');
const cantidadAmpicilina = document.getElementById('cantidad-ampicilina');
const cantidadTubi = document.getElementById('cantidad-tubi');

const subtotalEl = document.getElementById('subtotal');
const nombreCliente = document.getElementById('nombre');
const btnWhatsapp = document.getElementById('btn-whatsapp');

// Stock visible
const stockFohnText = document.getElementById('stock-fohn');
const stockCallosText = document.getElementById('stock-callos');
const stockAmpicilinaText = document.getElementById('stock-ampicilina');
const stockTubiText = document.getElementById('stock-tubi');

// Actualizar stock
function actualizarStock() {
  actualizarProducto(stock.fohn, stockFohnText, cantidadFohn);
  actualizarProducto(stock.callos, stockCallosText, cantidadCallos);
  actualizarProducto(stock.ampicilina, stockAmpicilinaText, cantidadAmpicilina);
  actualizarProducto(stock.tubi, stockTubiText, cantidadTubi);
}

function actualizarProducto(cantidad, textoEl, inputEl) {
  if(cantidad<=0){ 
    textoEl.textContent="AGOTADO"; 
    inputEl.value=0; 
    inputEl.disabled=true; 
  } else { 
    textoEl.textContent=`${cantidad} unidades disponibles`; 
    inputEl.disabled=false; 
    inputEl.max=cantidad; 
  }
}

// Subtotal dinámico
function actualizarSubtotal() {
  const total = (parseInt(cantidadFohn.value)||0)*60 
              + (parseInt(cantidadCallos.value)||0)*30
              + (parseInt(cantidadAmpicilina.value)||0)*5// Ampicilina ahora 10 €
              + (parseInt(cantidadTubi.value)||0)*5;        // Tubi ahora 5 €
  subtotalEl.textContent = `Subtotal: ${total} €`;
  return total;
}

// Validar inputs
function validarCantidad(input, max) {
  input.addEventListener('input', () => {
    let val=parseInt(input.value)||0;
    if(val<0) input.value=0;
    if(val>max) input.value=max;
    actualizarSubtotal();
  });
}

actualizarStock();
actualizarSubtotal();
validarCantidad(cantidadFohn, stock.fohn);
validarCantidad(cantidadCallos, stock.callos);
validarCantidad(cantidadAmpicilina, stock.ampicilina);
validarCantidad(cantidadTubi, stock.tubi);

// WhatsApp
btnWhatsapp.addEventListener('click',()=>{
  const nombre=nombreCliente.value.trim();
  const fohn=parseInt(cantidadFohn.value)||0;
  const callos=parseInt(cantidadCallos.value)||0;
  const ampi=parseInt(cantidadAmpicilina.value)||0;
  const tubi=parseInt(cantidadTubi.value)||0;
  const total=actualizarSubtotal();

  if(!nombre){ alert("Escribe tu nombre"); return; }
  if(total<=0){ alert("Selecciona al menos un producto"); return; }

  let mensaje=`Hola, soy ${nombre}, quiero comprar:%0A`;
  if(fohn>0) mensaje+=`${fohn} Föhn (Secador de Pelo)%0A`;
  if(callos>0) mensaje+=`${callos} Máquina Quita Callos%0A`;
  if(ampi>0) mensaje+=`${ampi} sobres de Ampicilina%0A`;   // cambiado a sobres
  if(tubi>0) mensaje+=`${tubi} Tubi%0A`;
  mensaje+=`Total: ${total}€`;

  window.open(`https://wa.me/31630779939?text=${mensaje}`,'_blank');
});

// PayPal Checkout dinámico
paypal.Buttons({
  createOrder:(data,actions)=>{
    const total=actualizarSubtotal();
    if(total<=0){ alert("Selecciona al menos un producto"); return; }
    return actions.order.create({ purchase_units:[{amount:{value:total.toString()}}] });
  },
  onApprove:(data,actions)=>{
    return actions.order.capture().then(details=>{
      alert(`Pago completado por ${details.payer.name.given_name}. ¡Gracias!`);
    });
  }
}).render('#paypal-button-container');
