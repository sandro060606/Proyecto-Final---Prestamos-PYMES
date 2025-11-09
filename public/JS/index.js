const API_URL = 'http://localhost:3000/api/index'

const totalClientes = document.getElementById('totalClientes')
const totalPrestamos = document.getElementById('totalPrestamos')

async function ObtenerEstadisticas() {
  try {
    const response = await fetch(API_URL, { method: 'get' })
    
    // Verificar si la respuesta es válida
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos de la API');
    }

    const data = await response.json()
    
    // Asignar los valores de la respuesta a los elementos del DOM
    totalClientes.textContent = data.totalClientes;
    totalPrestamos.textContent = data.totalPrestamos;

    // Mostrar notificación de éxito
    Swal.fire({
      icon: 'success',
      title: 'Datos actualizados',
      text: 'Los datos de clientes y préstamos se han cargado correctamente.'
    });

  } catch (error) {
    console.error('Error al obtener las estadísticas:', error);
    // Manejo de errores (puedes agregar un Swal de error aquí si lo deseas)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al cargar los datos.'
    });
  }
}
document.addEventListener("DOMContentLoaded", ObtenerEstadisticas)

