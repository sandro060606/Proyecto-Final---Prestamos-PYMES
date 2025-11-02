const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', clienteController.crearCliente);
router.get('/', clienteController.listarClientes);
router.get('/:id_cliente', clienteController.listarClientesPorId);
router.put('/:id_cliente', clienteController.actualizarCliente);
router.delete('/:id_cliente', clienteController.eliminarCliente);

module.exports = router;