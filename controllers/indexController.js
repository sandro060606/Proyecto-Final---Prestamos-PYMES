const db = require('../config/db');

//Contar el número de clientes y préstamos
exports.obtenerEstadisticas = async (req, res) => {
    const sqlNClientes = 'SELECT COUNT(*) AS total FROM clientes';
    const sqlNPrestamos = 'SELECT COUNT(*) AS total FROM prestamos';

    try{
        const [nclientes] =  await db.query(sqlNClientes);
        const [nprestamos] =  await db.query(sqlNPrestamos);
        res.status(200).json({
            totalClientes: nclientes[0].total,
            totalPrestamos: nprestamos[0].total
        });
    } catch (error) {
        console.error('Error al contar clientes y préstamos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}