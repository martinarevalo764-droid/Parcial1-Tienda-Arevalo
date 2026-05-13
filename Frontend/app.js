const API = 'http://localhost:3001/productos';

let todosLosProductos = [];
let vistaActual = 'lista';

// ── Íconos y clases por categoría ────────────────────────────
const categoriaConfig = {
  'CPU':            { icono: '🔲', clase: 'card-icon-cpu'  },
  'GPU':            { icono: '🎮', clase: 'card-icon-gpu'  },
  'RAM':            { icono: '💾', clase: 'card-icon-ram'  },
  'Almacenamiento': { icono: '💿', clase: 'card-icon-alm'  },
  'Periférico':     { icono: '🖱️', clase: 'card-icon-peri' },
  'Otro':           { icono: '🔧', clase: 'card-icon-otro' },
};

// ── Toast ─────────────────────────────────────────────────────
function mostrarToast(mensaje, tipo = 'success') {
  const toast = document.getElementById('toast');
  toast.innerHTML = `${tipo === 'success' ? '✅' : '❌'} ${mensaje}`;
  toast.className = tipo;
  toast.style.display = 'flex';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ── Badge categoría ───────────────────────────────────────────
function badgeCategoria(cat) {
  const mapa = {
    'CPU': 'badge-cpu', 'GPU': 'badge-gpu', 'RAM': 'badge-ram',
    'Almacenamiento': 'badge-almacenamiento', 'Periférico': 'badge-periferico',
  };
  return `<span class="badge ${mapa[cat] || 'badge-otro'}">${cat}</span>`;
}

// ── Filtrar productos según buscador + categoría ──────────────
function productosFiltrados() {
  const texto = document.getElementById('buscador').value.toLowerCase();
  const cat   = document.getElementById('filtro-categoria').value;
  return todosLosProductos.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(texto) ||
                          p.categoria.toLowerCase().includes(texto);
    const coincideCat   = !cat || p.categoria === cat;
    return coincideTexto && coincideCat;
  });
}

// ── Renderizar tabla ──────────────────────────────────────────
function renderizarTabla(productos) {
  const tbody = document.getElementById('cuerpo-tabla');
  tbody.innerHTML = '';
  if (productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="icon">📦</div><p>No se encontraron productos.</p></div></td></tr>`;
    return;
  }
  productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
    <td>${p.id}</td>
    <td>
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${p.imagen || 'https://via.placeholder.com/50'}" class="thumb-img" alt="${p.nombre}">
        ${p.nombre}
      </div>
    </td>
    <td>${badgeCategoria(p.categoria)}</td>
    <td class="precio">$${Number(p.precio).toLocaleString('es-AR')}</td>
    <td class="${p.stock <= 5 ? 'stock-low' : 'stock-ok'}">${p.stock}</td>
    <td class="acciones">
      <button class="btn btn-edit"   onclick="editarProducto(${p.id})">✏️ Editar</button>
      <button class="btn btn-delete" onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
    </td>`;
    tbody.appendChild(fila);
  });
}

// ── Renderizar grid de cartas ─────────────────────────────────
function renderizarGrid(productos) {
  const grid = document.getElementById('grid-productos');
  grid.innerHTML = '';
  if (productos.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="icon">📦</div><p>No se encontraron productos.</p></div>`;
    return;
  }
  productos.forEach(p => {
    const cfg      = categoriaConfig[p.categoria] || categoriaConfig['Otro'];
    const stockTxt = p.stock <= 5
      ? `<span class="stock-low">⚠️ Stock bajo: ${p.stock}</span>`
      : `<span class="stock-ok">✔ En stock: ${p.stock}</span>`;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-img-container">
    <img src="${p.imagen || 'https://via.placeholder.com/300x160?text=Sin+Imagen'}" alt="${p.nombre}">
  </div>
      <div class="card-body">
        <div>${badgeCategoria(p.categoria)}</div>
        <p class="card-nombre">${p.nombre}</p>
        <p class="card-desc">${p.descripcion || 'Sin descripción.'}</p>
        <p class="card-precio">$${Number(p.precio).toLocaleString('es-AR')}</p>
        <div class="card-stock" style="font-size:0.75rem">${stockTxt}</div>
      </div>
      <div class="card-footer">
        <button class="btn btn-edit"   onclick="editarProducto(${p.id})">✏️ Editar</button>
        <button class="btn btn-delete" onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
      </div>`;
    grid.appendChild(card);
  });
}

// ── Actualizar vista activa ───────────────────────────────────
function actualizarVista() {
  const filtrados = productosFiltrados();
  if (vistaActual === 'lista') renderizarTabla(filtrados);
  else                         renderizarGrid(filtrados);
}

// ── Cambiar entre pestañas ────────────────────────────────────
function cambiarVista(vista) {
  vistaActual = vista;
  document.getElementById('vista-lista').style.display  = vista === 'lista'  ? 'block' : 'none';
  document.getElementById('vista-tienda').style.display = vista === 'tienda' ? 'block' : 'none';
  document.getElementById('tab-lista').classList.toggle('active',  vista === 'lista');
  document.getElementById('tab-tienda').classList.toggle('active', vista === 'tienda');
  actualizarVista();
}

// ── Cargar productos desde la API ─────────────────────────────
async function cargarProductos() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();
    todosLosProductos = await res.json();
    actualizarVista();
  } catch {
    mostrarToast('No se pudo conectar con el servidor', 'error');
  }
}

// ── Filtros en tiempo real ────────────────────────────────────
document.getElementById('buscador').addEventListener('input', actualizarVista);
document.getElementById('filtro-categoria').addEventListener('change', actualizarVista);

// ── Submit formulario (crear o editar) ────────────────────────
document.getElementById('form-producto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('producto-id').value;
  const datos = {
    nombre:      document.getElementById('nombre').value.trim(),
    categoria:   document.getElementById('categoria').value,
    precio:      document.getElementById('precio').value,
    stock:       document.getElementById('stock').value || 0,
    descripcion: document.getElementById('descripcion').value.trim(),
    imagen:      document.getElementById('imagen').value.trim()
  };

  if (!datos.nombre)    return mostrarToast('El nombre es obligatorio', 'error');
  if (!datos.categoria) return mostrarToast('Seleccioná una categoría', 'error');
  if (datos.precio <= 0) return mostrarToast('El precio debe ser mayor a 0', 'error');

  try {
    const url    = id ? `${API}/${id}` : API;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!res.ok) throw new Error();
    mostrarToast(id ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
    limpiarFormulario();
    cargarProductos();
  } catch {
    mostrarToast('Ocurrió un error al guardar el producto', 'error');
  }
});

// ── Editar ────────────────────────────────────────────────────
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
    document.getElementById('imagen').value        = p.imagen || '';
    document.getElementById('form-titulo').textContent    = '✏️ Editar Producto';
    document.getElementById('btn-submit').textContent     = '💾 Guardar cambios';
    document.getElementById('btn-cancelar').style.display = 'inline-flex';
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
  } catch {
    mostrarToast('No se pudo cargar el producto', 'error');
  }
}

// ── Eliminar ──────────────────────────────────────────────────
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
