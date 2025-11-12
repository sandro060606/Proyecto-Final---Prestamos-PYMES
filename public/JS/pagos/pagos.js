const API_BASE_URL = "http://localhost:3000/api/pagos";
const API_URL_CLIENTES = `${API_BASE_URL}/clientes`; //Lista de Clientes
const API_URL_PRESTAMO_SALDO = `${API_BASE_URL}/prestamos/vigente`; // si Prestamo es Vigente mas Saldo Actual (Deuda)
// REFERENCIAS DEL DOM
const formulario = document.getElementById("formPago");
const listaClientes = document.getElementById("lista_clientes");
const idPrestamo = document.getElementById("id_prestamo");
const montoTotalPrestamo = document.getElementById("montoTotalPrestamo"); // Muestra la Deuda
const montopagado = document.getElementById("montopagado"); // Monto a Pagar
const deuda_anterior = document.getElementById("deuda_anterior"); // Almacena el valor NUMÉRICO de la deuda

//Cargar Deuda
async function cargarDeudaAlSeleccionarCliente(idCliente) {
  // 1. Resetear y limpiar campos
  idPrestamo.value = "";
  deuda_anterior.value = "0.00";
  montopagado.value = "";
  montopagado.disabled = true;
  montoTotalPrestamo.textContent = "0.00";

  if (!idCliente){ return;}

  try {
    const response = await fetch(`${API_URL_PRESTAMO_SALDO}/${idCliente}`);
    const data = await response.json();
    if (!data || !data.id_prestamo) {
      alert("El cliente no tiene Prestamo Activo (Vigente)");
      return;
    }

    const saldoActual = parseFloat(data.saldo_pendiente);

    idPrestamo.value = data.id_prestamo;
    deuda_anterior.value = saldoActual
    if (saldoActual > 0.00) {
      montoTotalPrestamo.textContent = `${saldoActual.toFixed(2)}`;
      montopagado.disabled = false;
      montopagado.setAttribute("max", saldoActual.toFixed(2));
      montopagado.placeholder = `Máximo: ${saldoActual.toFixed(2)}`;
    } else {
      montoTotalPrestamo.textContent = ". 0.00 (DEUDA SALDADA)";
      montopagado.disabled = true;
      montopagado.placeholder = "Deuda ya saldada.";
    }
  } catch (e) {
    console.error(e);
  }
}

// Cargar Clientes
async function obtenerClientes() {
  try {
    const response = await fetch(API_URL_CLIENTES);
    const clientes = await response.json();
    clientes.forEach((item) => {
      const tagOption = document.createElement("option");
      tagOption.value = item.id_cliente;
      tagOption.innerHTML = `${item.nombre_completo}`;
      listaClientes.appendChild(tagOption);
    });
  } catch (e) {
    console.error(e);
  }
}

// Enviar Pago
formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const montoAmortizar = parseFloat(montopagado.value);
  const saldoActual = parseFloat(deuda_anterior.value);

  if (montoAmortizar <= 0 || isNaN(montoAmortizar)) {
    alert("El monto a amortizar debe ser positivo.");
    return;
  }

  const formData = new FormData(formulario);
  formData.delete("id_cliente");
  formData.delete("deuda_anterior");

  // Envío de datos
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert(
        `Pago registrado. Nuevo saldo: S/. ${parseFloat(
          result.nuevo_saldo
        ).toFixed(2)}`
      );
      formulario.reset();
      cargarDeudaAlSeleccionarCliente(listaClientes.value);
    }
  } catch (e) {
    console.error(e);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerClientes();
  listaClientes.addEventListener("change", (e) => {
    const idCliente = e.target.value;
    cargarDeudaAlSeleccionarCliente(idCliente);
  });
});
