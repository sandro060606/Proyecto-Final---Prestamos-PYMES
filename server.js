const express = require('express');

//Enrutadores
const indexRoutes = require('./routes/indexRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

//Crear servidor
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Rutas
app.use('/api/index', indexRoutes);
app.use('/api/clientes', clienteRoutes);

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado http://localhost:${PORT}`);
});