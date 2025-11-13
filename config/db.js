//Acceso a datos
//Acceder al archivo .env
require('dotenv').config()

//Importa el módulo 'mysql2' configurado para usar Promesas
const mysql = require('mysql2/promise')

//Pool de conexiones = acceso (Mejorar Rendimiento)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
})

//Aprovechar el recurso en otra parte de la App
module.exports = pool