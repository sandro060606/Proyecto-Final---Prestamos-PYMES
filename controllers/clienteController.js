const db = require('../config/db')

//Crear
exports.crearCliente = async (req, res) => {
    const {nombre, apellido, tipodocumento, numerodocumento, telefono, direccion} = req.body;
    if(!nombre || !apellido || !tipodocumento || !numerodocumento || !telefono || !direccion) {
        return res.status(400).json({message: 'Falta Completar Campos'});
    }
    const sql = 'INSERT INTO clientes (nombre, apellido,tipodocumento,numerodocumento,telefono,direccion) VALUES (?,?,?,?,?,?)';
    try{
        const [result] = await db.query(sql, [nombre, apellido, tipodocumento, numerodocumento, telefono, direccion]);
        res.status(201).json({
            message: 'Cliente Creado Correctamente',
            clienteId: result.insertId
        });
    }catch(e){
        if(e.code === "ER_DUP_ENTRY"){
            return res.status(400).json({error: 'DNI esta duplicado'})
        }
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Listar
exports.listarClientes = async (req, res) => {
   const sql = "SELECT * FROM clientes";
    try{
        const [clientes] = await db.query(sql);
        res.status(200).json(clientes);
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Listar por ID
exports.listarClientesPorId = async (req, res) => {
    const {id_cliente} = req.params;
    const sql = "SELECT id_cliente, nombre, apellido, tipodocumento, numerodocumento, telefono, direccion FROM clientes WHERE id_cliente = ?";
    try{
        const [cliente] = await db.query(sql, [id_cliente]);
        if(cliente.length === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.status(200).json(cliente[0]);
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Actualizar
exports.actualizarCliente = async (req, res) => {
    const {id_cliente} = req.params;
    const {nombre, apellido, tipodocumento, numerodocumento, telefono, direccion} = req.body;
    if(!nombre && !apellido && !tipodocumento && !numerodocumento && !telefono && !direccion) {
        return res.status(400).json({message: 'Falta Completar Campos'});
    }
    let sqlParts = [];
    let values = [];
    if(nombre != undefined) {
        sqlParts.push('nombre = ?');
        values.push(nombre);
    }
    if(apellido != undefined) {
        sqlParts.push('apellido = ?');
        values.push(apellido);
    }
    if(tipodocumento != undefined) {
        sqlParts.push('tipodocumento = ?');
        values.push(tipodocumento);
    }
    if(numerodocumento != undefined) {
        sqlParts.push('numerodocumento = ?');
        values.push(numerodocumento);
    }
    if(telefono != undefined) {
        sqlParts.push('telefono = ?');
        values.push(telefono);
    }
    if(direccion != undefined) {
        sqlParts.push('direccion = ?');
        values.push(direccion);
    }
    if(sqlParts.length === 0) {
        return res.status(400).json({message: 'No hay campos para actualizar'});
    }
    values.push(id_cliente);
    const sql = `UPDATE clientes SET ${sqlParts.join(', ')} WHERE id_cliente = ?`;
    try{
        const [result] = await db.query(sql, values);
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.status(200).json({message: 'Cliente actualizado correctamente'});
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Eliminar
exports.eliminarCliente = async (req, res) => {
    const {id_cliente} = req.params;
    const sql = "DELETE FROM clientes WHERE id_cliente = ?";
    try{
        const [result] = await db.query(sql, [id_cliente]);
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.status(200).json({message: 'Cliente eliminado correctamente'});
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}
