//Importa Express
const express = require("express")
//Importar Enrutador
const router = express.Router()
//Importar Controlador
const prestamoController = require("../controllers/prestamoController")
//Importar 'upload'
const { upload } = require("../middleware/prestamoMiddleware")

//RUTAS

//Listar Todos Prestamos
router.get("/", prestamoController.listaPrestamos)
//Crear Prestamos -> Binario (Archivos)
router.post("/", upload.single("letracambio"), prestamoController.crearPrestamo)
//Listar Prestamos por Cliente especifico
router.get("/cliente/:id_cliente", prestamoController.listaPrestamosPorCliente)

//Exportar Enrutador
module.exports = router