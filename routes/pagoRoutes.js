const express = require("express")
const router = express.Router()
const pagoController = require("../controllers/pagoController")
const { upload } = require("../middleware/pagoMiddleware")

//Listar Pagos
router.get("/", pagoController.listaPagos)
//Crear Pago -> Binario
router.post("/", upload.single("evidencia"), pagoController.crearPago)
//Listar Pagos por ID de Prestamo
router.get("/:id_pago", pagoController.listaPagosporId)

module.exports = router