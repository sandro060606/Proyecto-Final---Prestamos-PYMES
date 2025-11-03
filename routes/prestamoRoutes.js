const express = require("express")
const router = express.Router()
const prestamoController = require("../controllers/prestamoController")
const { upload } = require("../middleware/prestamoMiddleware")

//Leer
router.get("/", prestamoController.listaPrestamos)
//Crear -> Binario
router.post("/", upload.single("letracambio"), prestamoController.crearPrestamo)
//Leer por ID
router.get("/:id_prestamo", prestamoController.listaPrestamosporId)
//Actualizar -> Binario
router.put("/:id_prestamo", upload.single("letracambio"), prestamoController.actualizarPrestamo)

module.exports = router