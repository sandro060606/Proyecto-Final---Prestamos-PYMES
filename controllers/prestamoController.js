//Importar el Pool
const db = require("../config/db");

//Listar Todos los Prestamos
exports.listaPrestamos = async (req, res) => {
  //Consulta SQL (Join Obtener datos del Cliente)
  const sql =  "SELECT CONCAT(cli.nombre, ' ', cli.apellido) AS cliente, cli.numerodocumento, pre.id_prestamo AS Numero_Prestamo, pre.prestamo, pre.pagototal, pre.fechaprestamo, pre.estado, pre.letracambio FROM clientes cli INNER JOIN prestamos pre ON cli.id_cliente = pre.id_cliente";
  try {
    //Ejecutar la Consulta
    const [prestamos] = await db.query(sql);
    res.status(200).json(prestamos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Crear Nuevo Prestamo
exports.crearPrestamo = async (req, res) => {
    //Extraccion de Datos
    const {prestamo,  fechaprestamo,  estado,  id_cliente} = req.body;
    //Obtencion de la ruta del Archivo y (Multer)
    const letracambio = req.file ? `/uploads/prestamos/${req.file.filename}` : null;
    //Calcula el interes
    const monto = parseFloat(prestamo); //Monto principal
    const pagototal = monto + (monto * 0.10); // Agregar 10% de interés
    //Consulta
    const sql = "INSERT INTO prestamos (prestamo,pagototal,fechaprestamo ,letracambio, estado, id_cliente) VALUES (?, ?, ?, ?, ?, ?)"
  try {
    //Ejecucion
    const [result] = await db.query(sql, [prestamo, pagototal, fechaprestamo, letracambio, estado, id_cliente]);
    res.status(201).json({
      id: result.insertId,
      message: "Prestamo Registrado correctamente",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Listar los Prestamos por Cliente
exports.listaPrestamosPorCliente = async (req, res) => {
  //Obtiene el Idcliente desde la URL  
  const { id_cliente } = req.params; 
  //Consulta para Obtener los Prestamos de un Cliente
  const sql = "SELECT pre.id_prestamo, pre.prestamo, pre.pagototal, pre.fechaprestamo, pre.estado, pre.letracambio FROM prestamos pre WHERE pre.id_cliente = ?";
    try {
        //Ejecucion
        const [prestamos] = await db.query(sql, [id_cliente]);
        res.status(200).json(prestamos); 
    } catch (e) {
        console.error(e);
        res.status(500).json({ mensaje: "Error interno del servidor al buscar historial de préstamos" });
    }
};
