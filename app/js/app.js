const KEY = 'utiles_inventario_v1';

const $ = id => document.getElementById(id);
const nombre = $('nombre');
const cantidad = $('cantidad');
const agregar = $('agregar');
const lista = $('lista');
const exportar = $('exportar');
const vaciar = $('vaciar');
const installBtn = $('installBtn');

let datos = cargar();

function cargar() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function guardar() { localStorage.setItem(KEY, JSON.stringify(datos)); }

function render() {
  lista.innerHTML = '';
  if (!datos.length) {
    const empty = document.createElement('div');
    empty.className = 'ghost';
    empty.textContent = 'Sin registros. Agrega tu primer útil 👇';
    lista.appendChild(empty);
    return;
  }
  datos.forEach((it, i) => {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div>${it.nombre}</div>
      <div class="pill">${it.cantidad}</div>
      <button class="danger" aria-label="Eliminar">✕</button>
    `;
    row.querySelector('button').onclick = () => {
      datos.splice(i, 1);
      guardar(); render();
    };
    lista.appendChild(row);
  });
}

agregar.onclick = () => {
  const n = (nombre.value || '').trim();
  const c = parseInt(cantidad.value, 10);
  if (!n) { nombre.focus(); return; }
  if (Number.isNaN(c) || c < 0) { cantidad.focus(); return; }
  datos.push({ nombre: n, cantidad: c });
  guardar(); render();
  nombre.value = ''; cantidad.value = '';
  nombre.focus();
};

exportar.onclick = () => {
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inventario_utiles.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

vaciar.onclick = () => {
  if (confirm('¿Seguro que quieres vaciar todo?')) {
    datos = []; guardar(); render();
  }
};

render();

// «Add to home screen» (Android)
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});
installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});
