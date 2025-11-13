//Importar Multer (Manejo Archivos)
const multer = require("multer")
//Importar Path (Rutas Archivos)
const path = require("path")
//Definir Directorio
const uploadDir = "./public/uploads/prestamos"

//Gestion de Escritura (Guardar Archivos)
const storage = multer.diskStorage({
    //Definir el destino
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    //Definir el Nombre de Archivo
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'prestamo-' + uniqueSuffix + path.extname(file.originalname))
    }
})

//Filtro Archivos
const fileFilter = (req, file, cb) => {
    //Acepta PDF
    const allowedTypes = /pdf/
    //Verificar Extension (.pdf)
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    //Verificar Tipo Mime (.pdf)
    const mimeType = allowedTypes.test(file.mimetype)
    if (mimeType && extname) {
        return cb(null, true)
    }else{
        cb(new Error('Solo se permiten archivos en formato PDF'))
    }
}

//Configuracion "multer"
const upload = multer({
    storage: storage, //Configuracion de Almacenamiento
    limits: { fileSize: 10 * 1024 * 1024 }, //Tamaño Maximo
    fileFilter: fileFilter //Configuracion Filtro
})

//Exportar la Configuracion
module.exports = { upload }