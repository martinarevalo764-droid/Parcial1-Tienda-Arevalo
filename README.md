# 🖥️ Tienda de Componentes — API REST con Node.js + MySQL

Proyecto full-stack para gestionar un catálogo de componentes de PC.
Cumple la consigna de **API REST propia con Node.js + MySQL** consumida
desde un frontend en **JavaScript vanilla**.

## 📦 Stack

- **Backend:** Node.js, Express 5, mysql2, dotenv, cors
- **Base de datos:** MySQL
- **Frontend:** HTML + CSS + JavaScript vanilla (`fetch`)

## 📁 Estructura

```
Tienda-Componentes/
├── Backend/
│   ├── index.js         # API REST (Express)
│   ├── db.js            # Conexión a MySQL
│   ├── database.sql     # Script de creación de la BD
│   ├── .env             # Variables de entorno
│   └── package.json
└── Frontend/
    ├── index.html
    ├── app.js           # Consume la API con fetch
    └── style.css
```

## 🚀 Instalación y ejecución

### 1) Crear la base de datos

Asegurate de tener MySQL corriendo y ejecutá:

```bash
mysql -u root -p < Backend/database.sql
```

Esto crea la base `tienda_componentes`, la tabla `productos` y carga datos de ejemplo.

### 2) Configurar variables de entorno

Editá `Backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_componentes
PORT=3001
```

### 3) Levantar el backend

```bash
cd Backend
npm install
npm start
```

Verás: `🚀 Servidor corriendo en http://localhost:3001`

### 4) Abrir el frontend

Abrí `Frontend/index.html` directamente en el navegador
(o serví la carpeta con `npx serve Frontend`).

## 🔌 Endpoints de la API

Base URL: `http://localhost:3001`

| Método | Ruta              | Descripción                    |
| ------ | ----------------- | ------------------------------ |
| GET    | `/productos`      | Lista todos los productos      |
| GET    | `/productos/:id`  | Obtiene un producto por ID     |
| POST   | `/productos`      | Crea un producto               |
| PUT    | `/productos/:id`  | Actualiza un producto          |
| DELETE | `/productos/:id`  | Elimina un producto            |

### Ejemplo POST

```json
{
  "nombre": "RTX 4070 Super",
  "categoria": "GPU",
  "precio": 950000,
  "stock": 5,
  "descripcion": "Gama alta 1440p",
  "imagen": "https://..."
}
```

## ✅ Funcionalidades del frontend

- Listado en **vista tabla** y **vista grilla** de tarjetas
- **Buscador** y **filtro por categoría** en tiempo real
- Crear / editar / eliminar productos
- Toast de feedback al usuario
- Indicador de stock bajo

## 🛠️ Decisiones técnicas

- **Express 5 + mysql2 (callback API):** simple y suficiente para CRUD.
- **Consultas parametrizadas** (`?, ?`) para prevenir SQL injection.
- **CORS habilitado** para permitir consumo desde el frontend estático.
- **Validación mínima** en POST (nombre, categoría y precio obligatorios).
- **Vanilla JS:** sin frameworks, foco en demostrar `fetch` contra la API propia.
