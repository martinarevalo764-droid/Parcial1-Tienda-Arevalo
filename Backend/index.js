// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// --- GET TODOS LOS PRODUCTOS ---
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(resultados);
  });
});

// --- GET PRODUCTO POR ID ---
app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultados.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(resultados[0]);
  });
});

// --- POST PRODUCTOS ---
app.post('/productos', (req, res) => {
  const { nombre, categoria, precio, stock, descripcion, imagen } = req.body;

  if (!nombre || !categoria || !precio) {
    return res.status(400).json({ error: 'Nombre, categoría y precio son obligatorios' });
  }

  const sql = 'INSERT INTO productos (nombre, categoria, precio, stock, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, categoria, precio, stock || 0, descripcion || '', imagen || ''], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Producto creado', id: resultado.insertId });
  });
});

// --- PUT PRODUCTOS (Actualizar) ---
app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock, descripcion, imagen } = req.body;

  const sql = 'UPDATE productos SET nombre=?, categoria=?, precio=?, stock=?, descripcion=?, imagen=? WHERE id=?';
  db.query(sql, [nombre, categoria, precio, stock, descripcion, imagen, id], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
});

// --- DELETE PRODUCTOS ---
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
