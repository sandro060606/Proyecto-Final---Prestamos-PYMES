const API_URL = "http://localhost:3000/api/clientes";

const formulario = document.getElementById("formCliente");
const tabla = document.getElementById("clientesTable");

const id_cliente_oculto = document.getElementById("idcliente");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const tipoDocumentoSelect = document.getElementById("tipoDocumento");
const numeroDocumentoInput = document.getElementById("numeroDocumento");
const telefonoInput = document.getElementById("telefono");
const direccionInput = document.getElementById("direccion");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

btnCancelar.addEventListener("click", () => {
  btnGuardar.innerText = "Guardar";
});

async function obtenerClientes() {
  const response = await fetch(API_URL, { method: "get" });
  const clientes = await response.json();
  tabla.innerHTML = "";

  clientes.forEach((cliente) => {
    const row = tabla.insertRow();
    row.insertCell().textContent = cliente.id_cliente;
    row.insertCell().textContent = cliente.nombre;
    row.insertCell().textContent = cliente.apellido;
    row.insertCell().textContent = cliente.tipodocumento;
    row.insertCell().textContent = cliente.numerodocumento;
    row.insertCell().textContent = cliente.telefono;
    row.insertCell().textContent = cliente.direccion;

    const actionCell = row.insertCell();
    actionCell.classList.add("text-center");

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn", "btn-info", "btn-sm", "me-2");
    editButton.onclick = () => cargarParaEdicion(cliente);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.onclick = () => eliminarCliente(
        cliente.id_cliente,
        cliente.nombre + " " + cliente.apellido
      );
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  });
}

function cargarParaEdicion(cliente) {
  id_cliente_oculto.value = cliente.id_cliente;
  nombreInput.value = cliente.nombre;
  apellidoInput.value = cliente.apellido;
  tipoDocumentoSelect.value = cliente.tipodocumento;
  numeroDocumentoInput.value = cliente.numerodocumento;
  telefonoInput.value = cliente.telefono;
  direccionInput.value = cliente.direccion;

  btnGuardar.innerText = "Actualizar";
}

async function eliminarCliente(id, nombreCompleto) {
  const result = await Swal.fire({
    title: "¿Está seguro?",
    text: `Se eliminará el cliente: ${nombreCompleto}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const resultData = await response.json();
      Swal.fire("Eliminado", resultData.message, "success");
      obtenerClientes();
    } catch (e) {
      console.error("Error al eliminar cliente:", e);
      Swal.fire("Error", "No se pudo conectar con el servidor.", "error"); 
    }
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = {
    nombre: nombreInput.value,
    apellido: apellidoInput.value,
    tipodocumento: tipoDocumentoSelect.value,
    numerodocumento: numeroDocumentoInput.value,
    telefono: telefonoInput.value,
    direccion: direccionInput.value,
  };

  try {
    let response = null;

    if (idcliente.value.trim() !== "") {
      response = await fetch(API_URL + `/${idcliente.value}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch(API_URL, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const result = await response.json();
    console.log(result);

    Swal.fire("Éxito", result.message, "success");

    btnGuardar.innerText = "Guardar";
    idcliente.value = "";
    formulario.reset();
    obtenerClientes();
  } catch (e) {
    console.error(e);
    Swal.fire("Error", e.message, "error");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerClientes();
});
