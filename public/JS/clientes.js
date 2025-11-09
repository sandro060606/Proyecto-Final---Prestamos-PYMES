const API_URL = 'http://localhost:3000/api/clientes';
const buscarBtn = document.getElementById('buscarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const clienteIdInput = document.getElementById('clienteId');
const resultadosBusqueda = document.getElementById('resultadosBusqueda');
const formCliente = document.getElementById('formCliente'); 
const clientesTable = document.getElementById('clientesTable');

// Función para obtener todos los clientes
async function obtenerClientes() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los clientes');
    }

    const clientes = await response.json();
    // Limpiar la tabla antes de agregar los nuevos resultados
    clientesTable.innerHTML = '';

    // Llenar la tabla con los datos de los clientes
    clientes.forEach(cliente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nombres}</td>
        <td>${cliente.apellidos}</td>
        <td>${cliente.tipoDocumento}</td>
        <td>${cliente.numeroDocumento}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.direccion}</td>
        <td>
          <button class="btn btn-warning btn-sm">Editar</button>
          <button class="btn btn-danger btn-sm">Eliminar</button>
        </td>
      `;
      clientesTable.appendChild(row);
    });

  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al cargar los clientes.'
    });
  }
}

// Función para buscar un cliente por ID
async function buscarCliente() {
  const clienteId = clienteIdInput.value.trim();

  if (clienteId === '') {
    Swal.fire({
      icon: 'warning',
      title: 'ID vacío',
      text: 'Por favor, ingresa un ID de cliente.'
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${clienteId}`);
    
    if (!response.ok) {
      throw new Error('Cliente no encontrado');
    }

    const cliente = await response.json();

    // Limpiar la tabla de búsqueda
    resultadosBusqueda.innerHTML = '';

    // Mostrar el cliente encontrado en la tabla de resultados
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nombres}</td>
      <td>${cliente.apellidos}</td>
      <td>${cliente.tipoDocumento}</td>
      <td>${cliente.numeroDocumento}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.direccion}</td>
    `;
    resultadosBusqueda.appendChild(row);

  } catch (error) {
    console.error('Error al buscar cliente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró un cliente con ese ID.'
    });
  }
}

// Función para agregar un nuevo cliente
async function agregarCliente(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nuevoCliente = {
    nombres: document.getElementById('nombre').value,
    apellidos: document.getElementById('apellido').value,
    tipoDocumento: document.getElementById('tipoDocumento').value,
    numeroDocumento: document.getElementById('numeroDocumento').value,
    telefono: document.getElementById('telefono').value,
    direccion: document.getElementById('direccion').value,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoCliente),
    });

    if (!response.ok) {
      throw new Error('Error al agregar el cliente');
    }

    // Limpiar el formulario
    formCliente.reset();

    // Recargar la lista de clientes
    obtenerClientes();

    // Notificar al usuario
    Swal.fire({
      icon: 'success',
      title: 'Cliente agregado',
      text: 'El cliente ha sido agregado exitosamente.',
    });
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar el cliente.',
    });
  }
}

// Función para limpiar la búsqueda
function limpiarBusqueda() {
  clienteIdInput.value = '';
  resultadosBusqueda.innerHTML = '';
}

// Agregar evento para el botón de buscar
buscarBtn.addEventListener('click', buscarCliente);

// Agregar evento para el botón de cancelar
cancelarBtn.addEventListener('click', limpiarBusqueda);

// Agregar evento para el formulario de agregar cliente
formCliente.addEventListener('submit', agregarCliente);

// Llamar a la función al cargar la página para mostrar todos los clientes
document.addEventListener('DOMContentLoaded', obtenerClientes);
