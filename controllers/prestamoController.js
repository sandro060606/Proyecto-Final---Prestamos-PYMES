const db = require("../config/db");
const path = require("path");

exports.listaPrestamos = async (req, res) => {
  const sql =
  "SELECT CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, cli.numerodocumento AS cliente_dni, pre.id_prestamo AS Numero_Prestamo, pre.prestamo, pre.pagototal, pre.fechaprestamo, pre.estado, pre.letracambio FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente";
  try {
    const [prestamos] = await db.query(sql);
    res.status(200).json(prestamos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.crearPrestamo = async (req, res) => {
  try {
    const {
      prestamo,
      fechaprestamo,
      estado,
      id_cliente,
    } = req.body;
    const letracambio = req.file ? `/uploads/prestamos/${req.file.filename}` : null;
    const monto = parseFloat(prestamo);
    const pagototal = monto + (monto * 0.10); // Agregar 10% de interés
    const [result] = await db.query(
      "INSERT INTO prestamos (prestamo,pagototal,fechaprestamo ,letracambio, estado, id_cliente) VALUES (?, ?, ?, ?, ?, ?)",
      [prestamo, pagototal, fechaprestamo, letracambio, estado, id_cliente]
    );
    res.status(201).json({
      id: result.insertId,
      message: "Prestamo Registrado correctamente",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.listaPrestamosPorCliente = async (req, res) => {
    const { id_cliente } = req.params; 
    const sql =
    "SELECT pre.id_prestamo, pre.prestamo, pre.pagototal, pre.fechaprestamo, pre.estado, pre.letracambio FROM prestamos pre WHERE pre.id_cliente = ?";
    try {
        const [prestamos] = await db.query(sql, [id_cliente]);
        res.status(200).json(prestamos); 
    } catch (e) {
        console.error(e);
        res.status(500).json({ mensaje: "Error interno del servidor al buscar historial de préstamos" });
    }
};
