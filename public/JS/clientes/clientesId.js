const API_URL = "http://localhost:3000/api/clientes";

const formulario = document.getElementById("formBusqueda");
const clienteId = document.getElementById("clienteId");
const tablaResultados = document.getElementById("resultadosBusqueda");

async function buscarClientes(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const id_cliente = clienteId.value.trim();
  let url = API_URL;

  if (id_cliente !== "") {
    url = `${API_URL}/${id_cliente}`;
  }

  try {
    const response = await fetch(url, { method: "GET" });
    if (response.status === 404 && id_cliente !== "") {
      Swal.fire(
        "No Encontrado",
        `El cliente con ID ${id_cliente} no existe.`,
        "warning"
      );
      renderizarTabla([]);
      return; 
    }

    let clientes = await response.json();

    if (id_cliente !== "" && !Array.isArray(clientes)) {
      clientes = [clientes];
    }

    renderizarTabla(clientes);
  } catch (e) {
    console.error("Error al realizar la búsqueda:", e);
    Swal.fire("Error", e.message, "error");
    renderizarTabla([]);
  }
}

function renderizarTabla(clientes) {
  tablaResultados.innerHTML = "";

  if (clientes.length === 0) {
    tablaResultados.innerHTML =
      '<tr><td colspan="7" class="text-center">No se encontraron clientes.</td></tr>';
    return;
  }

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

formulario.addEventListener("submit", buscarClientes);

document.getElementById("cancelarBtn").addEventListener("click", (e) => {
  e.preventDefault();
  clienteId.value = "";
  buscarClientes();
});

document.addEventListener("DOMContentLoaded", () => {
  buscarClientes();
});
