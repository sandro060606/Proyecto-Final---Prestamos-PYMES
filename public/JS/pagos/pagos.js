//URL API
const API_BASE_URL = "http://localhost:3000/api/pagos";
const API_URL_CLIENTES = "http://localhost:3000/api/clientes";
const API_URL_PRESTAMO_SALDO = `${API_BASE_URL}/prestamovigente`; // si Prestamo es Vigente + Saldo Actual (Deuda)
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
    //Peticion
    const response = await fetch(`${API_URL_PRESTAMO_SALDO}/${idCliente}`);
    //Respuesta
    const data = await response.json();
    //Si esta Vacio o Si no Tiene el IdPrestamo
    if (!data || !data.id_prestamo) {
      Swal.fire({
        title: "Sin Deuda Activa",
        text: "El cliente no tiene Prestamo Activo (Vigente)",
        icon: "info",
        confirmButtonText: "Entendido"
    });
      return;
    }
    //Obtiene el Valor Restante a Pagar
    const saldoActual = parseFloat(data.saldo_pendiente);
    //Se Actualiza los campos con la info del préstamo
    idPrestamo.value = data.id_prestamo;
    deuda_anterior.value = saldoActual
    if (saldoActual > 0.00) {
      montoTotalPrestamo.textContent = `${saldoActual.toFixed(2)}`;
      montopagado.disabled = false;
      // Limita el máximo valor de pago al saldo restante
      montopagado.setAttribute("max", saldoActual.toFixed(2));
      montopagado.placeholder = `Máximo: ${saldoActual.toFixed(2)}`;
    } else {
      //Deuda 0
      montoTotalPrestamo.textContent = ". 0.00 (DEUDA SALDADA)";
      montopagado.disabled = true;
      montopagado.placeholder = "Deuda ya saldada.";
    }
  } catch (e) {
    console.error(e);
  }
}

// Lista Clientes
async function obtenerClientes() {
  try {
    //Peticion
    const response = await fetch(API_URL_CLIENTES);
    //Respuesta
    const clientes = await response.json();
    //Carga los Clientes
    clientes.forEach((item) => {
      const tagOption = document.createElement("option");
      tagOption.value = item.id_cliente;
      tagOption.innerHTML = item.nombre + " " + item.apellido;
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
  //Validacion
  if (montoAmortizar <= 0) {
    alert("El monto a amortizar debe ser positivo.");
    return;
  }
  //Se obtienen todos los Valores del Formulario (Mas Sencillo)
  const formData = new FormData(formulario);

  // Eliminamos campos innecesarios
  formData.delete("id_cliente");
  formData.delete("deuda_anterior");

  // Envío de datos
  try {
    //Peticion
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: formData,
    });
    //Respuesta
    const result = await response.json();

    if (response.ok) {
      alert(
        `Pago registrado. Nuevo saldo: S/. ${parseFloat(
          result.nuevo_saldo
        ).toFixed(2)}`
      );
      formulario.reset();
      //Recarga Deuda al Cliente
      cargarDeudaAlSeleccionarCliente(listaClientes.value);
    }
  } catch (e) {
    console.error(e);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerClientes();
  //Evento Cambio el Select Clientes
  listaClientes.addEventListener("change", (event) => {
    const idCliente = event.target.value;
    cargarDeudaAlSeleccionarCliente(idCliente);
  });
});
