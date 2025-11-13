# Desarrollo e implementación del Sistema de Gestión de Préstamos para PYMES

Desarrollo de un Sistema Web para Gestionar Prestamos en Pymes de manera facil y rapida
Proyecto Final - Seminario de Ingeniería de Software**  
**SENATI - 2025**

**Autores**  
Rodríguez Anchante Sandro Steven  
Alcala Meneses Luis Orlando  

## 1. Clonar el repositorio

Clona el repositorio usando el siguiente comando:

```bash
git clone https://github.com/sandro060606/Proyecto-Final---Prestamos-PYMES.git
```

## Problema detectado

Las PYMES gestionan préstamos de forma **manual** (Excel o cuadernos), generando:

- Pérdida de información
- Cálculos lentos y propensos a errores
- Imposibilidad de generar reportes rápidos
- Dificultad para seguimiento de pagos

## Solución:

**Sistema Web 100% funcional** que automatiza **todo el ciclo de préstamos** desde el registro del cliente hasta el cierre del préstamo.


## Objetivos

### Objetivo General
Desarrollar un Sistema Web para gestionar préstamos en PYMES mediante operaciones **CRUD** de forma rápida, segura y eficiente

### Objetivos Específicos
- Registrar clientes, préstamos y pagos
- Calcular automáticamente el **10% de interés**
- Determinar estado del préstamo (**Vigente / Pagado**)
- Realizar búsquedas por ID
- Almacenar documentos: **Letra de Cambio (PDF)** y **evidencia de pago (JPG/PNG)**

## Funcionalidades Principales

| Módulo       | Funciones clave |
|--------------|------------------|
| **Clientes** | Registro • Búsqueda • Listado • Edición • Eliminación |
| **Préstamos** | Creación con interés 10% • Subida de Letra de Cambio (PDF) • Estado automático |
| **Pagos**    | Registro por Yape/Efectivo • Evidencia opcional • Cálculo de saldo restante |
| **Dashboard**| Total clientes • Total préstamos • Accesos rápidos |

**Cálculo de interés automático**  
```js
Total a pagar = Monto × 1.10
Saldo restante = Total a pagar - Σ pagos
Estado = (saldo === 0) ? "Pagado" : "Vigente"
```
Script SQL completo
```bash
CREATE DATABASE prestamo_pymes;
USE prestamo_pymes;

CREATE TABLE clientes(
id_cliente			INT AUTO_INCREMENT PRIMARY KEY,
nombre				VARCHAR(40) NOT NULL,
apellido			VARCHAR(40) NOT NULL,
tipodocumento			VARCHAR(20) NOT NULL,
numerodocumento			VARCHAR(15) NOT NULL UNIQUE,
telefono			CHAR(9) NOT NULL,
direccion			TEXT
)ENGINE=INNODB;

SELECT * FROM clientes;

CREATE TABLE prestamos(
id_prestamo			INT AUTO_INCREMENT PRIMARY KEY,
prestamo			DECIMAL(10,2) NOT NULL COMMENT 'Monto Prestado',
pagototal			DECIMAL(10,2) NOT NULL COMMENT 'Monto total a Devolver con Interes (10%)',
fechaprestamo			DATE NOT NULL,
letracambio			VARCHAR(200) NOT NULL COMMENT 'Se guarda la Ubicacion Fisica',
estado				VARCHAR(25) NOT NULL,
id_cliente			INT NOT NULL,
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
)ENGINE=INNODB;

SELECT * FROM prestamos;

CREATE TABLE pagos(
id_pago				INT AUTO_INCREMENT PRIMARY KEY,
fechapago			DATE NOT NULL,
tipopago			VARCHAR(40) NOT NULL,
montopagado			DECIMAL(10,2) NOT NULL COMMENT 'Monto Pagado de la Deuda',
montorestante			DECIMAL(10,2) NOT NULL COMMENT 'Monto Restatnte de la Deuda: 0 | O si falta pagar',
estado				VARCHAR(25) NOT NULL COMMENT 'Estado (Vigente / Pagado)',
evidencia			VARCHAR(200) NULL COMMENT 'Se guarda la Ubicacion Fisica | Opcional ya que el pago se puede realizar por Yape o "Fisico"',
id_prestamo			INT NOT NULL,
FOREIGN KEY (id_prestamo) REFERENCES prestamos(id_prestamo)
)ENGINE=INNODB;

SELECT * FROM pagos;

```
## Tecnologías Utilizadas
```bash
Backend:
  Node.js v20.17.0
  Express.js
  MySQL2 + Pool de conexiones
  Multer (subida de archivos)

Frontend:
  HTML5 • CSS3 • JavaScript vanilla
  SweetAlert2 • Toast notifications

Base de datos:
  MySQL 8.0 (XAMPP)

Herramientas:
  VS Code • Git • GitHub
  Postman (pruebas API)

```
## Estructura del Proyecto
```bash
PROYECTO FINAL-PRESTAMOS PINES/
├── config/          # .env + db.js
├── controllers/     # Lógica CRUD
├── db/              # pool MySQL
├── middleware/      # multer config
├── public/          # css, js, imagenes
├── routes/          # rutas API
├── views/           # páginas EJS
├── uploads/
│   ├── letras/      # PDFs letras de cambio
│   └── evidencias/  # JPG/PNG pagos
├── server.js
└── package.json
```
## Instalación
```bash
npm install
# Configura tu .env
cp .env.example .env
# Edita: DB_USER, DB_PASS, etc.
# Inicia MySQL (XAMPP)
# Ejecuta el script SQL
npm run dev

```