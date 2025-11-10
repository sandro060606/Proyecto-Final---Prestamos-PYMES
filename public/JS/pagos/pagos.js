const API_URL = 'http://localhost:3000/api/pagos';  
const guardarBtn = document.getElementById('guardarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const clienteSelect = document.getElementById('clienteSelect');
const prestamoSelect = document.getElementById('prestamoSelect');
const montoPagadoInput = document.getElementById('montoPagado');
const montoRestanteInput = document.getElementById('montoRestante');
const tipoPagoInput = document.getElementById('tipoPago');
const fechaPagoInput = document.getElementById('fechaPago');
const evidenciaInput = document.getElementById('evidenciaInput');
const resultadosTabla = document.getElementById('resultadosTabla');

// Función para obtener todos los pagos registrados
async function obtenerPagos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los pagos');
    }

    const pagos = await response.json();
    mostrarPagos(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al cargar los pagos.'
    });
  }
}

// Función para mostrar los pagos en la tabla
function mostrarPagos(pagos) {
  resultadosTabla.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos pagos

  pagos.forEach(pago => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pago.cliente}</td>
      <td>${pago.numeroPrestamo}</td>
      <td>${pago.fecha}</td>
      <td>${pago.tipoPago}</td>
      <td>${pago.montoPagado}</td>
      <td>${pago.montoRestante}</td>
      <td>${pago.estado}</td>
      <td><a href="${pago.evidencia}" target="_blank">${pago.evidencia}</a></td>
      <td>
        <button class="btn btn-primary btn-sm">Editar</button>
        <button class="btn btn-danger btn-sm">Eliminar</button>
      </td>
    `;
    resultadosTabla.appendChild(row);
  });
}

// Función para registrar un nuevo pago
async function registrarPago() {
  const nuevoPago = {
    cliente: clienteSelect.value,
    numeroPrestamo: prestamoSelect.value,
    montoPagado: montoPagadoInput.value,
    montoRestante: montoRestanteInput.value,
    tipoPago: tipoPagoInput.value,
    fecha: fechaPagoInput.value,
    evidencia: evidenciaInput.files[0]?.name || '', // Si hay archivo seleccionado
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoPago)
    });

    if (!response.ok) {
      throw new Error('Error al registrar el pago');
    }

    const data = await response.json();
    Swal.fire({
      icon: 'success',
      title: 'Pago Registrado',
      text: 'El pago se registró correctamente.'
    });

    // Volver a cargar la lista de pagos después de registrar
    obtenerPagos();
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al registrar el pago.'
    });
  }
}

// Función para limpiar los campos del formulario
function limpiarFormulario() {
  clienteSelect.value = '';
  prestamoSelect.value = '';
  montoPagadoInput.value = '';
  montoRestanteInput.value = '';
  tipoPagoInput.value = '';
  fechaPagoInput.value = '';
  evidenciaInput.value = '';
}

// Agregar eventos para los botones
guardarBtn.addEventListener('click', registrarPago);
cancelarBtn.addEventListener('click', limpiarFormulario);

// Llamar a la función para obtener los pagos cuando la página esté cargada
document.addEventListener('DOMContentLoaded', obtenerPagos);
