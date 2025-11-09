const API_URL = 'http://localhost:3000/api/index'

const totalClientes = document.getElementById('totalClientes')
const totalPrestamos = document.getElementById('totalPrestamos')

async function ObtenerEstadisticas() {
  const response = await fetch(API_URL, { method: 'get' })
  const data = await response.json()
  totalClientes.textContent = data.totalClientes;
  totalPrestamos.textContent = data.totalPrestamos;
}

document.addEventListener("DOMContentLoaded", ObtenerEstadisticas)