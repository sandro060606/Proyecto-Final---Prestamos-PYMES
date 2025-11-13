//URL API
const API_URL = "http://localhost:3000/api/clientes";
//Referencias DOOM
const formulario = document.getElementById("formBusqueda");
const clienteId = document.getElementById("clienteId");
const tablaResultados = document.getElementById("resultadosBusqueda");
const btnCancelar = document.getElementById("cancelarBtn");

//Funcion Buscar Clientes
async function buscarClientes(event) {
  if (event) {
    event.preventDefault();
  }
  //Obtiene el IDcliente desde el Fronted
  const id_cliente = clienteId.value.trim();
  //URL de la Peticion (Si hay ID lista por Id/ Si no Lista Todo)
  const url = id_cliente !== "" ? `${API_URL}/${id_cliente}` : API_URL;

  try {
    //Peticion a API
    const response = await fetch(url, { method: "GET" });
    //Cliente no Encontrado
    if (response.status === 404 && id_cliente !== "") {
      Swal.fire(
        "No Encontrado",
        `El cliente con ID ${id_cliente} no existe.`,
        "warning"
      );
      renderizarTabla([]); //Limpiar Tabla
      return;
    }
    //Respuesta de BUSCAR
    let clientes = await response.json();
    // Validacion: (Si Obtiene un Array o un Objeto)
    if (!Array.isArray(clientes)) {
      clientes = [clientes];
    }
    renderizarTabla(clientes);
  } catch (e) {
    console.error(e);
    Swal.fire("Error", e.message, "error");
    renderizarTabla([]);
  }
}

//Rellena la Tabla
function renderizarTabla(clientes) {
  //Limpia la Tabla
  tablaResultados.innerHTML = "";
  //Interacciona sobre Cada Cliente
  clientes.forEach((cliente) => {
    const row = tablaResultados.insertRow();
    row.insertCell().textContent = cliente.id_cliente;
    row.insertCell().textContent = cliente.nombre;
    row.insertCell().textContent = cliente.apellido;
    row.insertCell().textContent = cliente.tipodocumento;
    row.insertCell().textContent = cliente.numerodocumento;
    row.insertCell().textContent = cliente.telefono;
    row.insertCell().textContent = cliente.direccion;
  });
}

//Enviar Formulario
formulario.addEventListener("submit", buscarClientes);

//Limpiar el IdCliente y recarga la tabla
btnCancelar.addEventListener("click", () => {
  clienteId.value = "";
  renderizarTabla([]);
});

//Se llama a Buscar Clientes
document.addEventListener("DOMContentLoaded", () => {
  buscarClientes();
});
