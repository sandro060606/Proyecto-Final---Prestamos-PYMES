//Importar el Pool
const db = require("../config/db");

//Listar Todos los Pagos
exports.listaPagos = async (req, res) => {
  //Consulta para Obtener Datos de Clientes, Prestamo y Pagos
  const sql =  "SELECT pag.id_pago AS Num_Pago, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.id_prestamo AS Num_Prestamo, pag.fechapago, pag.tipopago,pre.pagototal , pag.montopagado, pag.montorestante, pag.estado AS Estado_Pago, pag.evidencia FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente INNER JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo ORDER BY pag.id_pago ASC";
  try {
    //Ejecucion
    const [pagos] = await db.query(sql);
    res.status(200).json(pagos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Obtiene el Id prestamo "Vigente" y su deuda
exports.prestamoVigente = async (req, res) => {
  //Obtiene el Idcliente desde la URL
  const { id_cliente } = req.params;
  // Consulta para encontrar el Prestamo Vigente
  const sqlPrestamo =  "SELECT id_prestamo, pagototal FROM prestamos WHERE id_cliente = ? AND estado = 'Vigente' LIMIT 1";
  try {
    //Ejecutar
    const [prestamos] = await db.query(sqlPrestamo, [id_cliente]);
    if (prestamos.length === 0) {
      return res.status(200).json({}); // No hay préstamos vigentes
    }
    //Desestructuracion de la Consulta
    const { id_prestamo, pagototal } = prestamos[0];
    //Calcular el Saldo Pendiente (Deuda Actual) sumando los pagos
    const sqlSaldo = `SELECT COALESCE(SUM(montopagado), 0) AS totalPagado FROM pagos WHERE id_prestamo = ?`;
    const [saldo] = await db.query(sqlSaldo, [id_prestamo]);
    const totalPagado = parseFloat(saldo[0].totalPagado);
    //Calcular Saldo Pendiente
    const saldo_pendiente = pagototal - totalPagado;
    res.status(200).json({
      id_prestamo: id_prestamo,
      pagototal: pagototal,
      saldo_pendiente: saldo_pendiente.toFixed(2),
    });
  } catch (e) {
    console.error(e);
  }
};

//Registrar Pago y Actualiza Estado
exports.crearPago = async (req, res) => {
  try {
    //Desestructuracion
    const { tipopago, fechapago, montopagado, id_prestamo } = req.body;
    //Ruta de la Evidencia
    const evidencia = req.file ? `/uploads/pagos/${req.file.filename}` : null;
    // Consulta para obtener Deuda Total y lo Pagado Antes de este nuevo
    const sql = `SELECT pre.pagototal, COALESCE(SUM(pag.montopagado), 0) AS totalYaPagado FROM prestamos pre LEFT JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo WHERE pre.id_prestamo = ? GROUP BY pre.id_prestamo;`
    //Ejecutar
    const [data] = await db.query(sql, [id_prestamo]);
    //Verificacion
    if (data.length === 0) {
      return res.status(404).json({ mensaje: "El ID de préstamo no existe." });
    }
    //Desestructuracion
    const { pagototal, totalYaPagado } = data[0];
    // Calculo de saldo
    const nuevoTotalPagado =  parseFloat(totalYaPagado) + parseFloat(montopagado);
    let nuevoMontoRestante = parseFloat(pagototal) - nuevoTotalPagado;
    //Si el saldo es Negativo
    if (nuevoMontoRestante < 0) {
      nuevoMontoRestante = 0.0;
    }
    //Dterminar Estado
    let estadoPago
    if (nuevoMontoRestante == 0.0) {
      estadoPago = "Pagado";
    } else {
      estadoPago = "Vigente";
    }
    //Consulta
    const sqlPago = "INSERT INTO pagos (tipopago, fechapago, montopagado, montorestante, id_prestamo, estado, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?)";
    //Ejecucion
    const [result] = await db.query(sqlPago, [  tipopago, fechapago, montopagado, nuevoMontoRestante, id_prestamo, estadoPago, evidencia]);
    //Cambiar Estado Pagado en Prestamos
    if (estadoPago === "Pagado") {
      const sqlPrestamo = "UPDATE prestamos SET estado = 'Pagado' WHERE id_prestamo = ?";
      await db.query( sqlPrestamo, [id_prestamo]);
    }
    res.status(201).json({
      id: result.insertId,
      mensaje: "Pago registrado correctamente",
      nuevo_saldo: nuevoMontoRestante,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Listar Pagos por ID Prestamo
exports.listaPagosporPrestamo = async (req, res) => {
  //Obtener IDprestamo por URL
  const { id_prestamo } = req.params;
  //Consulta para mostrar los Pagos de Un Prestamo (IDprestamo)
  const sql = "SELECT pag.id_pago AS Num_Pago, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.pagototal, pag.fechapago, pag.tipopago, pag.montopagado, pag.montorestante, pag.estado AS Estado_Pago, pag.evidencia FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente INNER JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo WHERE pre.id_prestamo = ? ORDER BY pag.id_pago ASC";
  try {
    //Ejecutar
    const [pago] = await db.query(sql, [id_prestamo]);
    //Verificacion
    if (pago.length == 0) {
      return res.status(404).json({ mensaje: "No encontramos los Pagos por este ID de Prestamo" });
    }
    res.status(200).json(pago);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
