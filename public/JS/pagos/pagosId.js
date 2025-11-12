const API_URL_PAGOS = "http://localhost:3000/api/pagos";

// Referencias a elementos del DOM
const formulario = document.getElementById("formBusqueda");
const id_Prestamo = document.getElementById("idPrestamo");
const tabla = document.getElementById("tablaPagos");

function renderizarPagos(pagos) {
  tabla.innerHTML = "";
  pagos.forEach((pago) => {
    const row = tabla.insertRow();

    row.insertCell().textContent = pago.cliente;
    row.insertCell().textContent = pago.Num_Pago;
    row.insertCell().textContent = pago.fechapago  ? new Date(pago.fechapago).toLocaleDateString("es-PE")  : "N/A";
    row.insertCell().textContent = pago.tipopago;
    row.insertCell().textContent = parseFloat(pago.pagototal).toFixed(2);
    row.insertCell().textContent = parseFloat(pago.montopagado).toFixed(2);
    row.insertCell().textContent = parseFloat(pago.montorestante).toFixed(2);
    row.insertCell().textContent = pago.Estado_Pago;

    const evidenciaCell = row.insertCell();
    if (pago.evidencia) {
      const btnEvidencia = document.createElement("button");
      btnEvidencia.textContent = "Evidencia";
      btnEvidencia.classList.add("btn", "btn-info", "btn-sm");
      btnEvidencia.onclick = () => verEvidencia(pago);
      evidenciaCell.appendChild(btnEvidencia);
    } else {
      evidenciaCell.textContent = "NULL";
    }
  });
}

function verEvidencia(pago) {
  // Verificamos que exista el objeto 'pago' y la 'evidencia'
  if (pago && pago.evidencia) {
    const urlIMG = pago.evidencia.startsWith("/")  ? `http://localhost:3000${pago.evidencia}`  : pago.evidencia;
    window.open(urlIMG, "_blank");
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const idPrestamo = id_Prestamo.value.trim();
  let urlListar = "";
  if (idPrestamo) {
    // Hay un ID. Busca por ID.
    // URL: /api/pagos/prestamo/ID
    urlListar = `${API_URL_PAGOS}/prestamo/${idPrestamo}`;
  } else {
    // No hay ID. Lista TODO.
    urlListar = API_URL_PAGOS;
  }
  try {
    // 3. Ejecuta el fetch con la URL final determinada
    const response = await fetch(urlListar);
    const data = await response.json();
    if (response.ok) {
      renderizarPagos(data);
    } else {
      renderizarPagos([]);
    }
  } catch (e) {
    console.error(e);
    renderizarPagos([]);
  }
});

document.getElementById("btnCancelarBusqueda").addEventListener("click", () => {
  formulario.reset();
  tabla.innerHTML = "";
});
