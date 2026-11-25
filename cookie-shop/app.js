const products = [
  { id: 1, name: "Galletita de Chocolate",  emoji: "🍫", desc: "Chips de chocolate belga derretidos en cada mordida",  price: 350 },
  { id: 2, name: "Galletita de Vainilla",   emoji: "🍪", desc: "Clásica y suave, con extracto de vainilla natural",     price: 280 },
  { id: 3, name: "Galletita de Limón",      emoji: "🍋", desc: "Fresca y cítrica, con glaseado de limón",               price: 300 },
  { id: 4, name: "Galletita de Frutilla",   emoji: "🍓", desc: "Rellena con mermelada artesanal de frutilla",           price: 320 },
  { id: 5, name: "Galletita de Maní",       emoji: "🥜", desc: "Crujiente con mantequilla de maní casera",              price: 310 },
  { id: 6, name: "Galletita Arcoíris",      emoji: "🌈", desc: "Colorida y divertida, con chips de colores",            price: 380 },
  { id: 7, name: "Galletita de Avena",      emoji: "🌾", desc: "Saludable y nutritiva con pasas de uva",                price: 260 },
  { id: 8, name: "Galletita de Coco",       emoji: "🥥", desc: "Exótica con coco rallado tostado",                      price: 330 },
];

let cart = {};

// ── Render productos ──────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-price">$${p.price}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">+ Agregar al carrito</button>
      </div>
    </div>
  `).join('');
}

// ── Carrito ───────────────────────────────────────────────────
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  const p = products.find(x => x.id === id);
  showToast(`${p.emoji} ${p.name} agregada!`);
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}

function updateCart() {
  const total   = Object.keys(cart).reduce((s, id) => s + cart[id], 0);
  const money   = Object.keys(cart).reduce((s, id) => {
    const p = products.find(x => x.id == id);
    return s + p.price * cart[id];
  }, 0);

  document.getElementById('cart-count').textContent = total;

  const itemsEl  = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  if (total === 0) {
    itemsEl.innerHTML  = '<p class="empty-msg">Tu carrito está vacío 🍪</p>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  document.getElementById('cart-total').textContent = `$${money}`;

  itemsEl.innerHTML = Object.keys(cart).map(id => {
    const p = products.find(x => x.id == id);
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price} c/u</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
          <span class="qty-num">${cart[id]}</span>
          <button class="qty-btn" onclick="changeQty(${id}, +1)">+</button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Panel carrito ─────────────────────────────────────────────
function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

// ── Checkout ──────────────────────────────────────────────────
function checkout() {
  cart = {};
  updateCart();
  toggleCart();
  showToast('🎉 ¡Pedido realizado con éxito!');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Init ──────────────────────────────────────────────────────
renderProducts();
