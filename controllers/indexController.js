//Importar Pool Conexiones
const db = require('../config/db');

//Contar el # Total de clientes y préstamos
exports.obtenerEstadisticas = async (req, res) => {
    //Consultas Para Obtener el # Total de Clientes y Prestamos
    const sqlNClientes = 'SELECT COUNT(*) AS total FROM clientes';
    const sqlNPrestamos = 'SELECT COUNT(*) AS total FROM prestamos';
    try{
        //Ejecutar Consultas
        const [nclientes] =  await db.query(sqlNClientes);
        const [nprestamos] =  await db.query(sqlNPrestamos);
        res.status(200).json({
            totalClientes: nclientes[0].total,
            totalPrestamos: nprestamos[0].total
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}