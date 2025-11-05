const db = require("../config/db");
const path = require("path");

exports.listaPrestamos = async (req, res) => {
  const sql =
    "SELECT CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.id_prestamo AS Numero_Prestamo, pre.prestamo, pre.pagototal, pre.fechaprestamo, pre.estado, pre.letracambio FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente";
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

exports.listaPrestamosporId = async (req, res) => {
  const { id_prestamo } = req.params;
  const sql =
    "SELECT pre.id_prestamo AS numero_prestamo, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.prestamo, pre.pagototal, pre.fechaprestamo, pre.estado, pre.letracambio FROM prestamos pre INNER JOIN clientes cli ON pre.id_cliente = cli.id_cliente WHERE pre.id_prestamo = ?";
  try {
    const [prestamo] = await db.query(sql, [id_prestamo]);
    if (prestamo.length == 0) {
      return res.status(404).json({ mensaje: "No encontramos el prestamo" });
    }
    res.status(200).json(prestamo[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarPrestamo = async (req, res) => {
  const { id_prestamo } = req.params;
  const { prestamo, pagototal, fechaprestamo, estado, id_cliente } = req.body;
  const nuevaLetraCambio = req.file ? `/uploads/prestamos/${req.file.filename}`    : null;

  let sqlParts = [];
  let values = [];

  if (prestamo != undefined) {
    sqlParts.push("prestamo = ?");
    values.push(prestamo);
  }
  if (pagototal != undefined) {
    sqlParts.push("pagototal = ?");
    values.push(pagototal);
  }
  if (fechaprestamo != undefined) {
    sqlParts.push("fechaprestamo = ?");
    values.push(fechaprestamo);
  }
  if (estado != undefined) {
    sqlParts.push("estado = ?");
    values.push(estado);
  }
  if (id_cliente != undefined) {
    sqlParts.push("id_cliente = ?");
    values.push(id_cliente);
  }
  if (nuevaLetraCambio) {
    sqlParts.push("letracambio = ?");
    values.push(nuevaLetraCambio);
  }
  if (sqlParts.length == 0) {
    return res.status(400).json({ mensaje: "No hay datos o archivo por actualizar" });
  }
  values.push(id_prestamo)
  const sql = `UPDATE prestamos SET ${sqlParts.join(', ')} WHERE id_prestamo = ?`
  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No encontramos el Préstamo con ID ${id_prestamo}` });
    }
    res.status(200).json({ mensaje: "Préstamo actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      mensaje: "Error interno en el servidor al actualizar el préstamo",
    });
  }
}
