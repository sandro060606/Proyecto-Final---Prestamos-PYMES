//URL API
const API_URL_PAGOS = "http://localhost:3000/api/pagos";

// Referencias a elementos del DOM
const formulario = document.getElementById("formBusqueda");
const id_Prestamo = document.getElementById("idPrestamo");
const tabla = document.getElementById("tablaPagos");

//Dibuja en la Tabla Pagos
function renderizarPagos(pagos) {
  tabla.innerHTML = "";
  // Itera sobre la lista de pagos
  pagos.forEach((pago) => {
    const row = tabla.insertRow();

    row.insertCell().textContent = pago.cliente;
    row.insertCell().textContent = pago.Num_Pago;
    row.insertCell().textContent = pago.fechapago && new Date(pago.fechapago).toLocaleDateString("es-PE");
    row.insertCell().textContent = pago.tipopago;
    row.insertCell().textContent = parseFloat(pago.pagototal).toFixed(2);
    row.insertCell().textContent = parseFloat(pago.montopagado).toFixed(2);
    row.insertCell().textContent = parseFloat(pago.montorestante).toFixed(2);
    row.insertCell().textContent = pago.Estado_Pago;

    //Celda para la Evidencia
    if (pago.evidencia) {
      const btnEvidencia = document.createElement("a");
      btnEvidencia.textContent = "Evidencia";
      btnEvidencia.classList.add("btn", "btn-info", "btn-sm");
      btnEvidencia.target = "_blank"; // Abrir en nueva pestaña
      btnEvidencia.href = pago.evidencia
      row.insertCell().appendChild(btnEvidencia);
    } else {
      row.insertCell().textContent = "NULL";
    }
  });
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  //Almacena el IdPrestamo
  const idPrestamo = id_Prestamo.value.trim();
  let urlListar = "";
  if (idPrestamo) {
    // Hay un ID. Busca por ID.
    // URL: /api/pagos/prestamo/ID
    urlListar = `${API_URL_PAGOS}/${idPrestamo}`;
  } else {
    // No hay ID. Lista TODO.
    urlListar = API_URL_PAGOS;
  }
  try {
    // Peticion
    const response = await fetch(urlListar);
    //Respuesta
    const data = await response.json();
    if (response.ok) {
      renderizarPagos(data);
    } else {
      renderizarPagos([]);
    }
  } catch (e) {
    console.error(e);
  }
});

document.getElementById("btnCancelarBusqueda").addEventListener("click", () => {
  formulario.reset();
  tabla.innerHTML = "";
});
