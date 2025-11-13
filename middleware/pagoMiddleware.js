//Importar Multer (Archivos)
const multer = require("multer")
//Importar Path (Rutas)
const path = require("path")
//Definir Directorio
const uploadDir = "./public/uploads/pagos"

//Gestion de Escritura (Guardar Archivos)
const storage = multer.diskStorage({
    //Destino
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    //Define Nombre
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'pago-' + uniqueSuffix + path.extname(file.originalname))
    }
})

//Filtro (Formato Imagen)
const fileFilter = (req, file, cb) => {
    //Extensiones de Imagen
    const allowedTypes = /jpg|jpeg|png/
    //Verificar Extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    //Verificar Tipo MIME
    const mimeType = allowedTypes.test(file.mimetype)
    if (mimeType && extname) {
        return cb(null, true)
    }else{
        cb(new Error('Solo se permiten archivos en formato JPG, JPEG o PNG'))
    }
}

//configuracion "multer" (Configuraciones)
const upload = multer({
    storage: storage, //Configuracion Almacenamiento
    limits: { fileSize: 5 * 1024 * 1024 }, //Limite 5MB
    fileFilter: fileFilter //Filtro de Imagenes
})

//Exportar 'upload'
module.exports = { upload }
