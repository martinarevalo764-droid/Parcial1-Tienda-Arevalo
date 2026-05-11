// frontend/app.js
const API = 'http://localhost:3001/productos';

// ── Cargar y mostrar todos los productos ──────────────────────
async function cargarProductos() {
  const res = await fetch(API);
  const productos = await res.json();

  const tbody = document.getElementById('cuerpo-tabla');
  tbody.innerHTML = '';

  productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${Number(p.precio).toLocaleString('es-AR')}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editarProducto(${p.id})">✏️ Editar</button>
        <button onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// ── Crear o actualizar producto (submit del form) ─────────────
document.getElementById('form-producto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('producto-id').value;
  const datos = {
    nombre:      document.getElementById('nombre').value,
    categoria:   document.getElementById('categoria').value,
    precio:      document.getElementById('precio').value,
    stock:       document.getElementById('stock').value,
    descripcion: document.getElementById('descripcion').value,
  };

  if (id) {
    // PUT — actualizar
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  } else {
    // POST — crear
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  }

  limpiarFormulario();
  cargarProductos();
});

// ── Cargar datos en el form para editar ──────────────────────
async function editarProducto(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();

  document.getElementById('producto-id').value  = p.id;
  document.getElementById('nombre').value        = p.nombre;
  document.getElementById('categoria').value     = p.categoria;
  document.getElementById('precio').value        = p.precio;
  document.getElementById('stock').value         = p.stock;
  document.getElementById('descripcion').value   = p.descripcion;

  document.getElementById('form-titulo').textContent = '✏️ Editar Producto';
  document.getElementById('btn-submit').textContent  = 'Guardar cambios';
  document.getElementById('btn-cancelar').style.display = 'inline';
}

// ── Eliminar producto ─────────────────────────────────────────
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que querés eliminar este producto?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  cargarProductos();
}

// ── Limpiar formulario ────────────────────────────────────────
function limpiarFormulario() {
  document.getElementById('form-producto').reset();
  document.getElementById('producto-id').value = '';
  document.getElementById('form-titulo').textContent = 'Agregar Producto';
  document.getElementById('btn-submit').textContent  = 'Agregar';
  document.getElementById('btn-cancelar').style.display = 'none';
}

document.getElementById('btn-cancelar').addEventListener('click', limpiarFormulario);

// ── Iniciar ───────────────────────────────────────────────────
cargarProductos();