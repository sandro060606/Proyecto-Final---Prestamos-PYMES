//URL API
const API_URL = "http://localhost:3000/api/clientes";

//Referencias DOOM
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

//Cambia Valor a Guardar
btnCancelar.addEventListener("click", () => {
  btnGuardar.innerText = "Guardar";
});

//Obtener Lista Completa de Clientes
async function obtenerClientes() {
  //Peticion
  const response = await fetch(API_URL, { method: "get" });
  //Respuesta
  const clientes = await response.json();
  //Limpia Tabla
  tabla.innerHTML = "";

  //Iteracion sobre Clientes para Dibujar las Filas
  clientes.forEach((cliente) => {
    const row = tabla.insertRow();
    row.insertCell().textContent = cliente.id_cliente;
    row.insertCell().textContent = cliente.nombre;
    row.insertCell().textContent = cliente.apellido;
    row.insertCell().textContent = cliente.tipodocumento;
    row.insertCell().textContent = cliente.numerodocumento;
    row.insertCell().textContent = cliente.telefono;
    row.insertCell().textContent = cliente.direccion;

    //Celdas para Botones de Eliminar - Editar
    const actionCell = row.insertCell();
    actionCell.classList.add("text-center");
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn", "btn-info", "btn-sm", "me-2");
    editButton.onclick = () => cargarParaEdicion(cliente);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.onclick = () => eliminarCliente(cliente.id_cliente);
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  });
}

//Rellena el Usuario con Valores del Cliente
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

//Elimina al Cliente
async function eliminarCliente(id) {
  //Confirmacion
  const result = await Swal.fire({
    title: "¿Está seguro?",
    text: `Se eliminará el cliente N° ${id}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    try {
      //Peticion
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      //Respuesta
      const resultData = await response.json();
      //Confirmacion
      Swal.fire("Cliente Eliminado", resultData.message, "success");
      obtenerClientes();
    } catch (e) {
      console.error(e);
    }
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  //Captura datos del Formulario
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

    //Validacion
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
    //Resultado
    const result = await response.json();
    console.log(result);
    //Mensaje
    Swal.fire("Éxito", result.message, "success");

    btnGuardar.innerText = "Guardar";
    idcliente.value = "";
    formulario.reset();
    obtenerClientes();
  } catch (e) {
    console.error(e);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerClientes();
});
