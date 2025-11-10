const API_URL = 'http://localhost:3000/api/prestamos';  // API para obtener los préstamos
const buscarBtn = document.getElementById('buscarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const prestamoIdInput = document.getElementById('prestamoId');
const resultadosBusqueda = document.getElementById('resultadosBusqueda');
const tablaPrestamos = document.getElementById('tablaPrestamos');

// Función para obtener la lista completa de préstamos
async function obtenerPrestamos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los préstamos');
    }

    const prestamos = await response.json();

    // Limpiar la tabla antes de agregar los nuevos resultados
    tablaPrestamos.innerHTML = '';

    // Llenar la tabla de préstamos
    prestamos.forEach(prestamo => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${prestamo.id}</td>
        <td>${prestamo.cliente}</td>
        <td>${prestamo.monto}</td>
        <td>${prestamo.montoPagar}</td>
        <td>${prestamo.fechaPrestamo}</td>
        <td>${prestamo.estado}</td>
        <td><a href="${prestamo.letraCambio}" target="_blank">Ver Letra</a></td>
      `;
      tablaPrestamos.appendChild(row);
    });

  } catch (error) {
    console.error('Error al obtener los préstamos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al cargar los préstamos.'
    });
  }
}

// Función para buscar un préstamo por ID
async function buscarPrestamo() {
  const prestamoId = prestamoIdInput.value.trim();

  if (prestamoId === '') {
    Swal.fire({
      icon: 'warning',
      title: 'ID vacío',
      text: 'Por favor, ingresa un ID de préstamo.'
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${prestamoId}`);
    
    if (!response.ok) {
      throw new Error('Préstamo no encontrado');
    }

    const prestamo = await response.json();

    // Limpiar la tabla de búsqueda
    resultadosBusqueda.innerHTML = '';

    // Mostrar el préstamo encontrado en la tabla de resultados
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${prestamo.id}</td>
      <td>${prestamo.cliente}</td>
      <td>${prestamo.monto}</td>
      <td>${prestamo.montoPagar}</td>
      <td>${prestamo.fechaPrestamo}</td>
      <td>${prestamo.estado}</td>
      <td><a href="${prestamo.letraCambio}" target="_blank">Ver Letra</a></td>
    `;
    resultadosBusqueda.appendChild(row);

  } catch (error) {
    console.error('Error al buscar préstamo:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró un préstamo con ese ID.'
    });
  }
}

// Función para limpiar la búsqueda
function limpiarBusqueda() {
  prestamoIdInput.value = '';
  resultadosBusqueda.innerHTML = '';
}

// Agregar evento para el botón de buscar
buscarBtn.addEventListener('click', buscarPrestamo);

// Agregar evento para el botón de cancelar
cancelarBtn.addEventListener('click', limpiarBusqueda);

// Llamar a la función al cargar la página para mostrar todos los préstamos
document.addEventListener('DOMContentLoaded', obtenerPrestamos);
