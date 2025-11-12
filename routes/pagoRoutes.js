const express = require("express")
const router = express.Router()
const pagoController = require("../controllers/pagoController")
const { upload } = require("../middleware/pagoMiddleware")

//Listar Pagos
router.get("/", pagoController.listaPagos)
//Listar los Clientes
router.get("/clientes", pagoController.listaClientes);
//Obtener el préstamo vigente y saldo pendiente
router.get("/prestamos/vigente/:id_cliente", pagoController.prestamoVigente);
//Crear Pago -> Binario
router.post("/", upload.single("evidencia"), pagoController.crearPago)
//Listar Pagos por ID de Prestamo
router.get("/prestamo/:id_prestamo", pagoController.listaPagosporPrestamo)

module.exports = router