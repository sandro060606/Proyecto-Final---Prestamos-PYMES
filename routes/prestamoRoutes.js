const express = require("express")
const router = express.Router()
const prestamoController = require("../controllers/prestamoController")
const { upload } = require("../middleware/prestamoMiddleware")

//Leer
router.get("/", prestamoController.listaPrestamos)
//Crear -> Binario
router.post("/", upload.single("letracambio"), prestamoController.crearPrestamo)
//Leer por Cliente
router.get("/cliente/:id_cliente", prestamoController.listaPrestamosPorCliente)

module.exports = router