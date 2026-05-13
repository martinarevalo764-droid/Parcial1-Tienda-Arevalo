# Tienda de Componentes — API REST con Node.js y MySQL
 
Proyecto integrador para la materia de Desarrollo Web. Consiste en una API REST
construida con Node.js que se conecta a una base de datos MySQL real, y un frontend
en JavaScript vanilla que la consume usando fetch.
 
La temática elegida es una tienda de componentes de computación y periféricos,
donde se pueden gestionar productos (agregar, editar, eliminar y buscar).
 
---
 
## Tecnologías usadas
 
**Backend:**
- Node.js con Express 5
- mysql2 para conectarse a la base de datos
- dotenv para manejar variables de entorno
- cors para permitir peticiones desde el frontend
**Base de datos:**
- MySQL (probado con XAMPP)
**Frontend:**
- HTML, CSS y JavaScript vanilla
- fetch para consumir la API
---
 
## Estructura del proyecto
 
```
Tienda-Componentes/
├── Backend/
│   ├── index.js         # servidor Express con los endpoints
│   ├── db.js            # conexion a MySQL
│   ├── .env             # credenciales (no se sube al repo)
│   └── package.json
└── Frontend/
    ├── index.html
    ├── app.js           # logica del frontend con fetch
    └── style.css

```
 
---
 
## Instalacion y puesta en marcha
 
### Requisitos previos
 
- Tener Node.js instalado
- Tener XAMPP (o cualquier servidor MySQL) corriendo
### 1. Crear la base de datos
 
Abrir phpMyAdmin, crear una base de datos llamada `tienda_componentes`
y ejecutar el siguiente SQL:                      

 
```sql
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  descripcion TEXT,
  imagen VARCHAR(255) DEFAULT NULL
);
```
 
### 2. Configurar el archivo .env
 
Dentro de la carpeta `Backend/`, crear un archivo `.env` con estos datos:
 
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda_componentes
PORT=3001
```
 
 
### 3. Instalar dependencias y levantar el backend
 
```bash
cd Backend
npm install
node index.js
```
 
Si la conexion fue exitosa, la terminal va a mostrar:
 
```
Conectado a MySQL correctamente
Servidor corriendo en http://localhost:3001
```
 
### 4. Abrir el frontend
 
Abrir el archivo `Frontend/index.html` directamente en el navegador.
No requiere servidor adicional.
 
---
 
## Endpoints de la API
 
Base URL: `http://localhost:3001`
 
| Metodo | Ruta             | Descripcion                  |
|--------|------------------|------------------------------|
| GET    | /productos       | Devuelve todos los productos |
| GET    | /productos/:id   | Devuelve un producto por ID  |
| POST   | /productos       | Crea un nuevo producto       |
| PUT    | /productos/:id   | Actualiza un producto        |
| DELETE | /productos/:id   | Elimina un producto          |
 
### Ejemplo de body para POST o PUT
 
```json
{
  "nombre": "RTX 4070 Super",
  "categoria": "GPU",
  "precio": 950000,
  "stock": 5,
  "descripcion": "Placa de video para 1440p",
  "imagen": "https://url-de-la-imagen.com/rtx4070.jpg"
}
```
 
---
 
## Funcionalidades del frontend
 
- Vista tabla y vista grilla de tarjetas (se puede cambiar con un boton)
- Buscador por nombre y filtro por categoria en tiempo real
- Formulario para crear y editar productos
- Boton para eliminar con confirmacion
- Notificaciones tipo toast para feedback al usuario
- Indicador visual de stock bajo (menos de 5 unidades)
---
 
## Autor
 
Martin Arevalo — Tecnicatura en Desarrollo de Software
Instituto Superior Villa del Rosario
