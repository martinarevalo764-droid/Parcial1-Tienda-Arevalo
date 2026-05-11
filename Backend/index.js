// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());                  // Permite peticiones del frontend
app.use(express.json());          // Parsea el body de las peticiones como JSON

// ─────────────────────────────────────────────
// GET /productos — Obtener todos los productos
// ─────────────────────────────────────────────
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(resultados);
  });
});

// ─────────────────────────────────────────────
// GET /productos/:id — Obtener un producto por ID
// ─────────────────────────────────────────────
app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultados.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(resultados[0]);
  });
});

// ─────────────────────────────────────────────
// POST /productos — Crear un nuevo producto
// ─────────────────────────────────────────────
app.post('/productos', (req, res) => {
  const { nombre, categoria, precio, stock, descripcion } = req.body;

  if (!nombre || !categoria || !precio) {
    return res.status(400).json({ error: 'Nombre, categoría y precio son obligatorios' });
  }

  const sql = 'INSERT INTO productos (nombre, categoria, precio, stock, descripcion) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, categoria, precio, stock || 0, descripcion || ''], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Producto creado', id: resultado.insertId });
  });
});

// ─────────────────────────────────────────────
// PUT /productos/:id — Actualizar un producto
// ─────────────────────────────────────────────
app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock, descripcion } = req.body;

  const sql = 'UPDATE productos SET nombre=?, categoria=?, precio=?, stock=?, descripcion=? WHERE id=?';
  db.query(sql, [nombre, categoria, precio, stock, descripcion, id], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
});

// ─────────────────────────────────────────────
// DELETE /productos/:id — Eliminar un producto
// ─────────────────────────────────────────────
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});