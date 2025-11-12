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

const historialClienteDiv = document.getElementById("historialCliente");
const btnGuardar = document.getElementById("btnGuardar");

async function obtenerClientes() {
  try {
    const response = await fetch(API_URL_CLIENTES, { method: "get" });
    const clientes = await response.json();
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

function VerPdf(prestamo) {
  if (prestamo.letracambio) {
    //Construye la URL para el PDF usando la ruta relativa guardada en DB
    const urlPDF = prestamo.letracambio.startsWith("/")
      ? `http://localhost:3000${prestamo.letracambio}`
      : prestamo.letracambio;
    window.open(urlPDF, "_blank");
  }
}

async function cargarHistorialCliente(idCliente) {
  try {
    const response = await fetch(`${API_URL_PRESTAMOS}/cliente/${idCliente}`, {
      method: "GET",
    });
    const historial = await response.json();
    tabla.innerHTML = "";

    if (Array.isArray(historial) && historial.length !== 0) {
      historial.forEach((prestamo) => {
        const row = tabla.insertRow();
        row.insertCell().textContent = prestamo.id_prestamo;
        row.insertCell().textContent = parseFloat(prestamo.prestamo).toFixed(2);
        row.insertCell().textContent = parseFloat(prestamo.pagototal).toFixed(
          2
        );
        row.insertCell().textContent = prestamo.fechaprestamo
          ? new Date(prestamo.fechaprestamo).toLocaleDateString("es-PE")
          : "N/A";
        row.insertCell().textContent = prestamo.estado;
        const actionCell = row.insertCell();

        const buttonpdf = document.createElement("button");
        buttonpdf.textContent = "Ver PDF";
        buttonpdf.classList.add("btn", "btn-secondary", "btn-sm");
        actionCell.appendChild(buttonpdf);
        //Se usa una función flecha para pasar el objeto 'prestamo' a VerPdf al hacer clic
        buttonpdf.onclick = () => VerPdf(prestamo);
      });
    }
  } catch (e) {
    console.error(e);
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const idClienteSeleccionado = listaClientes.value;
  try {
    const response = await fetch(
      `${API_URL_PRESTAMOS}/cliente/${idClienteSeleccionado}`,
      { method: "GET" }
    );

    const historial = await response.json();
    //Se Usa .some() para verificar si al menos un registro tiene estado 'vigente'
    const tienePrestamoVigente = historial.some(
      (p) => p.estado.toLowerCase() === "vigente"
    );

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
    const formData = new FormData();
    formData.append("id_cliente", idClienteSeleccionado);
    formData.append("prestamo", prestamo.value);
    formData.append("fechaprestamo", fechaprestamo.value);
    formData.append("estado", estadoprestamo.value);

    const archivoPDF = document.getElementById("letracambio").files[0];
    if (archivoPDF) {
      formData.append("letracambio", archivoPDF);
    }

    try {
      const response = await fetch(API_URL_PRESTAMOS, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
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

prestamo.addEventListener("input", calcularPagoTotal);

listaClientes.addEventListener("change", (cliente) => {
  //Se Usa 'cliente.target.value' para obtener el ID del cliente seleccionado
  const idCliente = cliente.target.value;
  if (!idCliente || idCliente === "Seleccione un cliente") {
    // Si no hay ID válido, limpia la tabla.
    tabla.innerHTML = "";
    return;
  }
  cargarHistorialCliente(idCliente);
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerClientes();
  calcularPagoTotal();
});
