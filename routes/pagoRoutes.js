//Importar Express
const express = require("express")
//Importar Enrutador
const router = express.Router()
//Importar Controlador
const pagoController = require("../controllers/pagoController")
//Importar 'upload'
const { upload } = require("../middleware/pagoMiddleware")

//Rutas

//Listar Todos los Pagos
router.get("/", pagoController.listaPagos)
//Obtener Prestamo Vigente y Saldo pendiente
router.get("/prestamovigente/:id_cliente", pagoController.prestamoVigente);
//Crear Pago
router.post("/", upload.single("evidencia"), pagoController.crearPago)
//Listar Pago por Prestamo
router.get("/:id_prestamo", pagoController.listaPagosporPrestamo)

//Exportar Enrutador
module.exports = router