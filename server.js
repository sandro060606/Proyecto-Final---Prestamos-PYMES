const express = require('express');

const indexRoutes = require('./routes/indexRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/index', indexRoutes);

app.listen(PORT, () => {
    console.log(`Servidor iniciado http://localhost:${PORT}`);
});