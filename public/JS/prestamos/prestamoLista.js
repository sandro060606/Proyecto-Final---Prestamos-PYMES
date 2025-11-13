//URL API
const API_URL_PRESTAMOS = "http://localhost:3000/api/prestamos";

//Referencias DOOM
const tablaBody = document.getElementById("prestamosBody");
const totalRegistrosSpan = document.getElementById("totalRegistros");

//Obtener Prestamos
async function obtenerPrestamos() {
  //Peticion
  const response = await fetch(API_URL_PRESTAMOS, { method: "get" });
  //Respuesta
  const result = await response.json();
  tablaBody.innerHTML = "";
  
  //Recorrer y Renderizar
  result.forEach((prestamo) => {
    const row = tablaBody.insertRow();

    row.insertCell().textContent = prestamo.Numero_Prestamo;
    row.insertCell().textContent = prestamo.cliente;
    row.insertCell().textContent = prestamo.cliente_dni;
    row.insertCell().textContent = prestamo.prestamo;
    row.insertCell().textContent = prestamo.pagototal;
    row.insertCell().textContent = prestamo.fechapago && new Date(prestamo.fechaprestamo).toLocaleDateString("es-PE");
    row.insertCell().textContent = prestamo.estado;
    //Boton PDF
    const pdfCell = row.insertCell();
    pdfCell.classList.add("text-center");

    const pdfButton = document.createElement("a");
    pdfButton.textContent = "Ver PDF";
    pdfButton.classList.add("btn", "btn-sm", "btn-info");
    pdfButton.target = "_blank"; // Abrir en nueva pestaña
    pdfButton.href = prestamo.letracambio;
    pdfCell.appendChild(pdfButton);
  });
  //Mostrar el Numero de Registros
  totalRegistrosSpan.textContent = result.length;
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerPrestamos();
});
