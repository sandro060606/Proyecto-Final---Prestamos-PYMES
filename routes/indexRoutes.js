//Importar Express
const express = require('express');
//Crear Enrutador
const router = express.Router();
//Importar el Controlador
const indexController = require('../controllers/indexController');

//Rutas

router.get('/', indexController.obtenerEstadisticas);

//Exportar Enrutador
module.exports = router;