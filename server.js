const express = require('express');
const path = require('path');

//Enrutadores
const indexRoutes = require('./routes/indexRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

const fs = require('fs').promises

//Crear servidor
const app = express();
const PORT = process.env.PORT || 3000;

const uploadDirPrestamos = './public/uploads/prestamos'
fs.mkdir(uploadDirPrestamos, {recursive: true})

const uploadDirPagos = './public/uploads/pagos'
fs.mkdir(uploadDirPagos, {recursive: true})

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Rutas
app.use('/api/index', indexRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/pagos', pagoRoutes);

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado http://localhost:${PORT}`);
});