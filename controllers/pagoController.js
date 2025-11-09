const db = require("../config/db");
const path = require("path");

exports.listaPagos = async (req, res) => {
    const sql = "SELECT pag.id_pago AS N_Pago, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.id_prestamo AS Num_Prestamo, pag.fechapago, pag.tipopago, pag.montopagado, pag.montorestante, pag.estado AS Estado_Prestamo, pag.evidencia FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente INNER JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo"
    try{
        const [pagos] =  await db.query(sql)
        res.status(200).json(pagos)
    }catch(e){
        console.error(e)
        res.status(500).json({mensaje: "Error interno del servidor"})
    }
}

exports.crearPago = async (req, res) => {
    try {
        const { tipopago, fechapago, montopagado, id_prestamo } = req.body; 
        const evidencia = req.file ? `/uploads/pagos/${req.file.filename}` : null;
        const [data] = await db.query(
            //Consulta para Obtener el Monto Total a Devolver / y el Monto Pagado hasta el momento
            `SELECT  pre.pagototal, SUM(pag.montopagado) AS totalYaPagado FROM prestamos pre LEFT JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo WHERE  pre.id_prestamo = ? GROUP BY pre.id_prestamo;`,
            [id_prestamo]
        );
        if (data.length === 0) {
            return res.status(404).json({ mensaje: "El ID de préstamo no existe." });
        }
        //Se Destructura Objetos y se Asigna a la constante     
        const { pagototal: montoTotalDeuda, totalYaPagado } = data[0]; // pagototal: montoTotalDeuda, Asigna nuevo nombre a Pago Total
        //Se calcula el Monto Restante
        const nuevoTotalPagado = parseFloat(totalYaPagado) + parseFloat(montopagado);
        let nuevoMontoRestante = parseFloat(montoTotalDeuda) - nuevoTotalPagado;
        if (nuevoMontoRestante < 0) nuevoMontoRestante = 0.00;
        //Se asigna el estado a la variable para insertarla en el pago 
        let estadoPago
        if(nuevoMontoRestante === 0){
            estadoPago = 'Pagado';
        }else{
            estadoPago = 'Vigente';
        }
        const [result] = await db.query(
            "INSERT INTO pagos (tipopago, fechapago, montopagado, montorestante, id_prestamo, estado, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [tipopago, fechapago, montopagado, nuevoMontoRestante, id_prestamo, estadoPago, evidencia]
        );
        //Si el estado del Pago es Pagado se Actualiza la tabla Prestamos su estado
        if (estadoPago === 'Pagado') {
            await db.query(
                "UPDATE prestamos SET estado = 'Pagado' WHERE id_prestamo = ?",
                [id_prestamo]
            );
        }
        res.status(201).json({
            id: result.insertId,
            mensaje: "Pago registrado correctamente",
            nuevo_saldo: nuevoMontoRestante
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ mensaje: "Error interno del servidor al crear pago" });
    }
};

exports.listaPagosporId = async (req, res) => {
    const { id_pago } = req.params
    const sql = 
    "SELECT pag.id_pago AS Num_Pago, CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, pre.pagototal AS Monto_Total_Prestamo, pag.fechapago, pag.tipopago, pag.montopagado, pag.montorestante, pag.estado AS Estado_Pago, pag.evidencia FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente INNER JOIN pagos pag ON pre.id_prestamo = pag.id_prestamo WHERE pre.id_prestamo = ? ORDER BY pag.id_pago ASC"
    try{
        const [pago] =  await db.query(sql, [id_pago])
        if(pago.length == 0){
            return res.status(404).json({mensaje: "No encontramos los Pagos por este ID de Prestamo"})
        }
        res.status(200).json(pago)
    }catch(e){
        console.error(e)
        res.status(500).json({mensaje: "Error interno del servidor"})
    }
}