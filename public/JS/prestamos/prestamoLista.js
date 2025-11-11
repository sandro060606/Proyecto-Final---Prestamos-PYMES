const API_URL_PRESTAMOS = "http://localhost:3000/api/prestamos";

const tablaBody = document.getElementById("prestamosBody");
const totalRegistrosSpan = document.getElementById("totalRegistros");

async function obtenerPrestamos() {
  const response = await fetch(API_URL_PRESTAMOS, { method: "get" });
  const prestamos = await response.json();

  tablaBody.innerHTML = "";

  prestamos.forEach((prestamo) => {
    const row = tablaBody.insertRow();
    const fecha = new Date(prestamo.fechaprestamo).toLocaleDateString("es-PE");

    row.insertCell().textContent = prestamo.Numero_Prestamo;
    row.insertCell().textContent = prestamo.cliente;
    row.insertCell().textContent = prestamo.cliente_dni;
    row.insertCell().textContent = prestamo.prestamo;
    row.insertCell().textContent = prestamo.pagototal;
    row.insertCell().textContent = fecha;
    row.insertCell().textContent = prestamo.estado;
    const pdfCell = row.insertCell();
    pdfCell.classList.add("text-center");

    const pdfButton = document.createElement("a");
    pdfButton.textContent = "Ver PDF";
    pdfButton.classList.add("btn", "btn-sm", "btn-info");
    pdfButton.target = "_blank"; // Abrir en nueva pestaña
    pdfButton.href = prestamo.letracambio;
    pdfCell.appendChild(pdfButton);
  });

  totalRegistrosSpan.textContent = prestamos.length;
}
document.addEventListener("DOMContentLoaded", () => {
  obtenerPrestamos();
});
