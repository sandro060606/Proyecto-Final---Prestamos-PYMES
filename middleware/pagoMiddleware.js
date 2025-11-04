const multer = require("multer")
const path = require("path")
const uploadDir = "./public/uploads/pagos"

//Gestion de Escritura
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'pago-' + uniqueSuffix + path.extname(file.originalname))
    }
})

//Filtro (¿Que tipo de archivos se esta permitido?)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)
    if (mimeType && extname) {
        return cb(null, true)
    }else{
        cb(new Error('Solo se permiten archivos en formato JPG, JPEG o PNG'))
    }
}

//configuracion "multer"
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5 MB
    fileFilter: fileFilter
})

//Exportar
module.exports = { upload }
