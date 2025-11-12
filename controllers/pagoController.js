const db = require("../config/db");

//Listar los Pagos
exports.listaPagos = async (req, res) => {
  //Selecciona los datos necesarios para mostrar como lista de pagos ordenado por el Numero de Pago
  const sql =
    "SELECT pag.id_pago AS Num_Pago, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.id_prestamo AS Num_Prestamo, pag.fechapago, pag.tipopago,pre.pagototal , pag.montopagado, pag.montorestante, pag.estado AS Estado_Pago, pag.evidencia FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente INNER JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo ORDER BY pag.id_pago ASC";
  try {
    const [pagos] = await db.query(sql);
    res.status(200).json(pagos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Lista de Clientes (Fronted)
exports.listaClientes = async (req, res) => {
  // Concatena el nombre y apellido en una sola columna ('nombre_completo')
  const sql =
    "SELECT id_cliente, CONCAT(nombre, ' ', apellido) AS nombre_completo FROM clientes";
  try {
    const [clientes] = await db.query(sql);
    res.status(200).json(clientes); //Devuelve la lista de clientes (ID y nombre completo)
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error al listar clientes" });
  }
};

//Obtiene el Id prestamo "Vigente" y su deuda
exports.prestamoVigente = async (req, res) => {
  const { id_cliente } = req.params;
  // Encontrar el préstamo vigente (solo necesitamos el ID y el total a pagar)
  const sqlPrestamo =
    "SELECT id_prestamo, pagototal FROM prestamos WHERE id_cliente = ? AND estado = 'Vigente' LIMIT 1";
  try {
    const [prestamos] = await db.query(sqlPrestamo, [id_cliente]);
    if (prestamos.length === 0) {
      return res.status(200).json({}); // No hay préstamos vigentes
    }
    const { id_prestamo, pagototal } = prestamos[0];
    //Calcula el saldo pendiente (Deuda actual) sumando los pagos
    const sqlSaldo = `
            SELECT COALESCE(SUM(montopagado), 0) AS totalPagado
            FROM pagos 
            WHERE id_prestamo = ?;
        `;
    const [saldoData] = await db.query(sqlSaldo, [id_prestamo]);
    const totalPagado = parseFloat(saldoData[0].totalPagado);
    const saldo_pendiente = pagototal - totalPagado;
    // Devuelve el ID del préstamo y el SALDO PENDIENTE
    res.status(200).json({
      id_prestamo: id_prestamo,
      pagototal: pagototal,
      saldo_pendiente: saldo_pendiente.toFixed(2),
    });
  } catch (e) {
    console.error(e);
  }
};

//Crear y Actualiza Estado
exports.crearPago = async (req, res) => {
  try {
    const { tipopago, fechapago, montopagado, id_prestamo } = req.body;
    const evidencia = req.file ? `/uploads/pagos/${req.file.filename}` : null;

    // Consulta para obtener el total de la deuda y lo que ya se pagó
    const [data] = await db.query(
      `SELECT pre.pagototal, COALESCE(SUM(pag.montopagado), 0) AS totalYaPagado 
             FROM prestamos pre 
             LEFT JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo 
             WHERE pre.id_prestamo = ? 
             GROUP BY pre.id_prestamo;`,
      [id_prestamo]
    );

    if (data.length === 0) {
      return res.status(404).json({ mensaje: "El ID de préstamo no existe." });
    }

    const { pagototal: montoTotalDeuda, totalYaPagado } = data[0];

    // Lógica para calcular el nuevo saldo y determinar el estado.
    const nuevoTotalPagado =
      parseFloat(totalYaPagado) + parseFloat(montopagado);
    let nuevoMontoRestante = parseFloat(montoTotalDeuda) - nuevoTotalPagado;
    if (nuevoMontoRestante < 0) {
      nuevoMontoRestante = 0.0;
    }
    let estadoPago;
    if (nuevoMontoRestante == 0.0) {
      estadoPago = "Pagado";
    } else {
      estadoPago = "Vigente";
    }

    const [result] = await db.query(
      "INSERT INTO pagos (tipopago, fechapago, montopagado, montorestante, id_prestamo, estado, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        tipopago,
        fechapago,
        montopagado,
        nuevoMontoRestante,
        id_prestamo,
        estadoPago,
        evidencia,
      ]
    );
    if (estadoPago === "Pagado") {
      await db.query(
        "UPDATE prestamos SET estado = 'Pagado' WHERE id_prestamo = ?",
        [id_prestamo]
      );
    }

    res.status(201).json({
      id: result.insertId,
      mensaje: "Pago registrado correctamente",
      nuevo_saldo: nuevoMontoRestante,
    });
  } catch (e) {
    console.error(e);
  }
};

//Listat Los pagos por el Id del Prestamo
exports.listaPagosporPrestamo = async (req, res) => {
  const { id_prestamo } = req.params;
  //Selecciona los datos necesarios para mostrar como lista de pagos filtrado por el ID Prestamo y  ordenado por el Numero de Pago
  const sql =
    "SELECT pag.id_pago AS Num_Pago, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.pagototal, pag.fechapago, pag.tipopago, pag.montopagado, pag.montorestante, pag.estado AS Estado_Pago, pag.evidencia FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente INNER JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo WHERE pre.id_prestamo = ? ORDER BY pag.id_pago ASC";
  try {
    const [pago] = await db.query(sql, [id_prestamo]);
    if (pago.length == 0) {
      return res.status(404).json({ mensaje: "No encontramos los Pagos por este ID de Prestamo" });
    }
    res.status(200).json(pago);
  } catch (e) {
    console.error(e);
  }
};
