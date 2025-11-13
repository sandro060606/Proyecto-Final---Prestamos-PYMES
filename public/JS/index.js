//Endpoint API
const API_URL = 'http://localhost:3000/api/index'

//Referencias Doom
const totalClientes = document.getElementById('totalClientes')
const totalPrestamos = document.getElementById('totalPrestamos')

async function ObtenerEstadisticas() {
  try {
    //Peticion
    const response = await fetch(API_URL, { method: 'get' })
    const data = await response.json()
    // Asignar los valores de la respuesta a los elementos del DOM
    totalClientes.textContent = data.totalClientes;
    totalPrestamos.textContent = data.totalPrestamos;
  } catch (e) {
    console.error(e);
  }
}
//Doom Listo llama la Funcion
document.addEventListener("DOMContentLoaded", ObtenerEstadisticas)