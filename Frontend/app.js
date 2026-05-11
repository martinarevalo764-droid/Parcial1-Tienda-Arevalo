// frontend/app.js
// frontend/app.js
const API = 'http://localhost:3001/productos';

let todosLosProductos = []; // guardamos todos para el buscador

// ── Toast de notificaciones ───────────────────────────────────
function mostrarToast(mensaje, tipo = 'success') {
  const toast = document.getElementById('toast');
  const icono = tipo === 'success' ? '✅' : '❌';
  toast.innerHTML = `${icono} ${mensaje}`;
  toast.className = tipo;
  toast.style.display = 'flex';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ── Badge de categoría ────────────────────────────────────────
function badgeCategoria(categoria) {
  const mapa = {
    'CPU':            'badge-cpu',
    'GPU':            'badge-gpu',
    'RAM':            'badge-ram',
    'Almacenamiento': 'badge-almacenamiento',
    'Periférico':     'badge-periferico',
  };
  const clase = mapa[categoria] || 'badge-otro';
  return `<span class="badge ${clase}">${categoria}</span>`;
}

// ── Renderizar tabla ──────────────────────────────────────────
function renderizarTabla(productos) {
  const tbody = document.getElementById('cuerpo-tabla');
  tbody.innerHTML = '';

  if (productos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="icon">📦</div>
            <p>No se encontraron productos.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  productos.forEach(p => {
    const stockClass = p.stock <= 5 ? 'stock-low' : 'stock-ok';
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${badgeCategoria(p.categoria)}</td>
      <td class="precio">$${Number(p.precio).toLocaleString('es-AR')}</td>
      <td class="${stockClass}">${p.stock}</td>
      <td class="acciones">
        <button class="btn btn-edit"   onclick="editarProducto(${p.id})">✏️ Editar</button>
        <button class="btn btn-delete" onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// ── Cargar todos los productos ────────────────────────────────
async function cargarProductos() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Error al obtener productos');
    todosLosProductos = await res.json();
    renderizarTabla(todosLosProductos);
  } catch (err) {
    mostrarToast('No se pudo conectar con el servidor', 'error');
  }
}

// ── Buscador en tiempo real ───────────────────────────────────
document.getElementById('buscador').addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = todosLosProductos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.categoria.toLowerCase().includes(texto)
  );
  renderizarTabla(filtrados);
});

// ── Crear o actualizar producto ───────────────────────────────
document.getElementById('form-producto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('producto-id').value;
  const datos = {
    nombre:      document.getElementById('nombre').value.trim(),
    categoria:   document.getElementById('categoria').value,
    precio:      document.getElementById('precio').value,
    stock:       document.getElementById('stock').value || 0,
    descripcion: document.getElementById('descripcion').value.trim(),
  };

  // Validaciones básicas
  if (!datos.nombre) return mostrarToast('El nombre es obligatorio', 'error');
  if (!datos.categoria) return mostrarToast('Seleccioná una categoría', 'error');
  if (datos.precio <= 0) return mostrarToast('El precio debe ser mayor a 0', 'error');

  try {
    if (id) {
      // PUT — actualizar
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (!res.ok) throw new Error();
      mostrarToast('Producto actualizado correctamente');
    } else {
      // POST — crear
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (!res.ok) throw new Error();
      mostrarToast('Producto agregado correctamente');
    }

    limpiarFormulario();
    cargarProductos();

  } catch {
    mostrarToast('Ocurrió un error al guardar el producto', 'error');
  }
});

// ── Cargar datos en el form para editar ──────────────────────
async function editarProducto(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error();
    const p = await res.json();

    document.getElementById('producto-id').value  = p.id;
    document.getElementById('nombre').value        = p.nombre;
    document.getElementById('categoria').value     = p.categoria;
    document.getElementById('precio').value        = p.precio;
    document.getElementById('stock').value         = p.stock;
    document.getElementById('descripcion').value   = p.descripcion || '';

    document.getElementById('form-titulo').textContent    = '✏️ Editar Producto';
    document.getElementById('btn-submit').textContent     = '💾 Guardar cambios';
    document.getElementById('btn-cancelar').style.display = 'inline-flex';

    // Scroll al formulario
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });

  } catch {
    mostrarToast('No se pudo cargar el producto', 'error');
  }
}

// ── Eliminar producto ─────────────────────────────────────────
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que querés eliminar este producto?')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    mostrarToast('Producto eliminado correctamente');
    cargarProductos();
  } catch {
    mostrarToast('No se pudo eliminar el producto', 'error');
  }
}

// ── Limpiar formulario ────────────────────────────────────────
function limpiarFormulario() {
  document.getElementById('form-producto').reset();
  document.getElementById('producto-id').value           = '';
  document.getElementById('form-titulo').textContent     = 'Agregar Producto';
  document.getElementById('btn-submit').textContent      = '+ Agregar producto';
  document.getElementById('btn-cancelar').style.display  = 'none';
}

document.getElementById('btn-cancelar').addEventListener('click', limpiarFormulario);

// ── Iniciar ───────────────────────────────────────────────────
cargarProductos();