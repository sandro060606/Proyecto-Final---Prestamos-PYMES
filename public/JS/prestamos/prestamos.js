//URL API
const API_URL_CLIENTES = "http://localhost:3000/api/clientes";
const API_URL_PRESTAMOS = "http://localhost:3000/api/prestamos";
//Referencias a elementos del DOM
const formulario = document.getElementById("formPrestamo");
const tabla = document.querySelector("#tabla-prestamos tbody");

const listaClientes = document.getElementById("lista_clientes");
const idprestamo = document.getElementById("id_prestamo");
const prestamo = document.getElementById("prestamo");
const pagototal = document.getElementById("pagototal");
const fechaprestamo = document.getElementById("fechaprestamo");
const estadoprestamo = document.getElementById("estadoprestamo");

const btnGuardar = document.getElementById("btnGuardar");

//Obtener Lista Clientes
async function obtenerClientes() {
  try {
    //Peticion
    const response = await fetch(API_URL_CLIENTES, { method: "get" });
    //Respuesta
    const clientes = await response.json();
    //Iteraccion Llenar el Select
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

//Calcular el Monto Total a Pagar (Vista)
function calcularPagoTotal() {
  //Calculo del Monto total con el Interes 10%
  const monto = parseFloat(prestamo.value);
  const interes = 0.1;
  if (isNaN(monto) || monto <= 0) {
    pagototal.value = "0.00";
    return;
  }
  const totalPagar = monto + monto * interes;
  pagototal.value = totalPagar.toFixed(2);
}

//Cargar Historial del Prestamo
async function cargarHistorialCliente(idCliente) {
  try {
    //Peticion
    const response = await fetch(`${API_URL_PRESTAMOS}/cliente/${idCliente}`, {
      method: "GET",
    });
    //Respuesta
    const historial = await response.json();
    tabla.innerHTML = "";
    // Validacion: (Si Obtiene un Array o un Objeto)
    if (Array.isArray(historial)) {
      historial.forEach((prestamo) => {
        const row = tabla.insertRow();
        row.insertCell().textContent = prestamo.id_prestamo;
        row.insertCell().textContent = parseFloat(prestamo.prestamo).toFixed(2);
        row.insertCell().textContent = parseFloat(prestamo.pagototal).toFixed( 2);
        row.insertCell().textContent = prestamo.fechaprestamo  && new Date(prestamo.fechaprestamo).toLocaleDateString("es-PE")
        row.insertCell().textContent = prestamo.estado;

        //Boton PDF
        const actionCell = row.insertCell();

        const buttonpdf = document.createElement("a");
        buttonpdf.textContent = "Ver PDF";
        buttonpdf.classList.add("btn", "btn-secondary", "btn-sm");
        actionCell.appendChild(buttonpdf);
        buttonpdf.target = "_blank";
        buttonpdf.href = prestamo.letracambio;
      });
    }
  } catch (e) {
    console.error(e);
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  //Asiga el Id del Cliente Seleccionado
  const idClienteSeleccionado = listaClientes.value;
  try {
    //Peticion
    const response = await fetch(
      `${API_URL_PRESTAMOS}/cliente/${idClienteSeleccionado}`,
      { method: "GET" }
    );
    //Respuesta
    const historial = await response.json();
    //Se Usa .some() para verificar si al menos un registro tiene estado 'vigente'
    const tienePrestamoVigente = historial.some(
      (p) => p.estado.toLowerCase() === "vigente"
    );
    //Mensaje
    if (tienePrestamoVigente) {
      Swal.fire({
        icon: "warning",
        title: "Registro Cancelado",
        text: "El cliente seleccionado tiene un préstamo en estado 'vigente'",
        confirmButtonText: "Entendido",
      });
      return;
    }
  } catch (e) {
    console.error("e");
  }

  // Se usa 'await' y se guarda el resultado en 'confirmacion' para poder verificarlo
  const confirmacion = await Swal.fire({
    title: "¿Desea registrar este préstamo?",
    text: "Una vez registrado, no podrá ser modificado por este usuario",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, Registrar",
    cancelButtonText: "Cancelar",
  });

  //Se ejecuta el POST solo si el usuario confirma (isConfirmed)
  if (confirmacion.isConfirmed) {
    //Datos del Formulario
    const formData = new FormData();
    formData.append("id_cliente", idClienteSeleccionado);
    formData.append("prestamo", prestamo.value);
    formData.append("fechaprestamo", fechaprestamo.value);
    formData.append("estado", estadoprestamo.value);

    formData.append("letracambio", document.getElementById("letracambio").files[0]);

    try {
      //Peticion
      const response = await fetch(API_URL_PRESTAMOS, {
        method: "POST",
        body: formData,
      });
      //Respuesta
      const result = await response.json();
      //Exito
      if (response.ok) {
        Swal.fire("¡Registrado!", result.message, "success");
        formulario.reset();
        calcularPagoTotal();
        cargarHistorialCliente(idClienteSeleccionado);
      }
    } catch (e) {
      console.error(e);
    }
  }
});

//Cambiar Monto Se Recalcula el Pago
prestamo.addEventListener("input", calcularPagoTotal);
//si se Cambia el Cliente Seleccionado
listaClientes.addEventListener("change", (cliente) => {
  //Se Usa 'cliente.target.value' para obtener el ID del cliente seleccionado
  const idCliente = cliente.target.value;
  if (!idCliente) {
    // Si no hay ID válido, limpia la tabla.
    tabla.innerHTML = "";
    return;
  }
  cargarHistorialCliente(idCliente);
});

//Cargar Clientes y Calcular el Pago Total Incial
document.addEventListener("DOMContentLoaded", () => {
  obtenerClientes();
  calcularPagoTotal();
});
