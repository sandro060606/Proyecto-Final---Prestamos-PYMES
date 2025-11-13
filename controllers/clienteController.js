//Importar el Pool y nombrarlo db
const db = require('../config/db')

//Crear Cliente
exports.crearCliente = async (req, res) => {
    //Deestructurar campos de la solicitud
    const {nombre, apellido, tipodocumento, numerodocumento, telefono, direccion} = req.body;
    //validacion Basica
    if(!nombre || !apellido || !tipodocumento || !numerodocumento || !telefono || !direccion) {
        return res.status(400).json({message: 'Falta Completar Campos'});
    }
    //Consulta para insertar Cliente
    const sql = 'INSERT INTO clientes (nombre, apellido,tipodocumento,numerodocumento,telefono,direccion) VALUES (?,?,?,?,?,?)';
    try{
        //Ejecuta la consulta 
        const [result] = await db.query(sql, [nombre, apellido, tipodocumento, numerodocumento, telefono, direccion]);
        res.status(201).json({
            message: 'Cliente Creado Correctamente',
            clienteId: result.insertId
        });
    }catch(e){
        //Manejo de error en duplicacion (DNI)
        if(e.code === "ER_DUP_ENTRY"){
            return res.status(400).json({error: 'DNI esta duplicado'})
        }
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Listar todos los Clientes
exports.listarClientes = async (req, res) => {
   //Consulta para seleccionar todos los Clientes
    const sql = "SELECT * FROM clientes";
    try{
        //Ejecuta la consulta y obtiene los Clientes
        const [clientes] = await db.query(sql);
        res.status(200).json(clientes);
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Listar Cliente por ID
exports.listarClientesPorId = async (req, res) => {
    //Obtiene el Id cliente del Parametro (URL)
    const {id_cliente} = req.params;
    //Consulta para seleccionar Cliente por ID
    const sql = "SELECT id_cliente, nombre, apellido, tipodocumento, numerodocumento, telefono, direccion FROM clientes WHERE id_cliente = ?";
    try{
        //Ejecutar Consulta
        const [cliente] = await db.query(sql, [id_cliente]);
        //Verificacion
        if(cliente.length === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.status(200).json(cliente[0]);
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Actualizar Cliente
exports.actualizarCliente = async (req, res) => {
    //Obtiene el Id cliente del Parametro (URL)
    const {id_cliente} = req.params;
    //Obtiene los Posibles campos a actualizar
    const {nombre, apellido, tipodocumento, numerodocumento, telefono, direccion} = req.body;
    //Validacion
    if(!nombre && !apellido && !tipodocumento && !numerodocumento && !telefono && !direccion) {
        return res.status(400).json({message: 'Falta Completar Campos'});
    }
    let sqlParts = []; //Almacenar partes de clausulas
    let values = []; //Almacenar Valores
    //Construir la Consulta Dinamicamente
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
    //Si no encuentra ningun Campo
    if(sqlParts.length === 0) {
        return res.status(400).json({message: 'No hay campos para actualizar'});
    }
    //Agrega el ID al final del array
    values.push(id_cliente);
    //Contruye la Consulta
    const sql = `UPDATE clientes SET ${sqlParts.join(', ')} WHERE id_cliente = ?`;
    try{
        //Ejecuta la Consulta
        const [result] = await db.query(sql, values);
        //Verificacion
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.status(200).json({message: 'Cliente actualizado correctamente'});
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

//Eliminar Cliente
exports.eliminarCliente = async (req, res) => {
    //Obtiene el IDcliente desde la URL
    const {id_cliente} = req.params;
    //Consulta para Eliminar
    const sql = "DELETE FROM clientes WHERE id_cliente = ?";
    try{
        //Ejecutar Consulta
        const [result] = await db.query(sql, [id_cliente]);
        //Verificacion
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        res.status(200).json({message: 'Cliente eliminado correctamente'});
    }catch(e){
        console.error(e);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}
