//Importar Express
const express = require('express');
//Crear un Enrutado (Manejo de Rutas)
const router = express.Router();
//Importar el Controlador
const clienteController = require('../controllers/clienteController');

//Rutas

router.post('/', clienteController.crearCliente);
router.get('/', clienteController.listarClientes);
router.get('/:id_cliente', clienteController.listarClientesPorId);
router.put('/:id_cliente', clienteController.actualizarCliente);
router.delete('/:id_cliente', clienteController.eliminarCliente);

//Exportar el Enrutador
module.exports = router;