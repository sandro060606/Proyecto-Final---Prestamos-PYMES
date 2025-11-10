const express = require('express');
const cors = require('cors')
const path = require('path');

const fs = require('fs').promises

//Enrutadores
const indexRoutes = require('./routes/indexRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

//Crear servidor
const app = express();
const PORT = process.env.PORT || 3000;

//*** CONFIGURACION ***
//Actualización - Permisos cors
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}))

const uploadDirPrestamos = './public/uploads/prestamos'
fs.mkdir(uploadDirPrestamos, {recursive: true})

const uploadDirPagos = './public/uploads/pagos'
fs.mkdir(uploadDirPagos, {recursive: true})

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))

// ***ROUTEOS > FRONTEND***
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/index.html'))
})
app.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/clientes/clientes.html'))
})
app.get('/clientes/clientesId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/clientes/clientesId.html'))
})
app.get('/prestamos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/prestamos/prestamos.html'))
})
app.get('/prestamos/prestamosLista', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/prestamos/prestamoslista.html'))
})
app.get('/pagos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/pagos/pagos.html'))
})
app.get('/pagos/pagosListaId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/pagos/pagosId.html'))
})

//Rutas
app.use('/api/index', indexRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/pagos', pagoRoutes);

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado http://localhost:${PORT}`);
});