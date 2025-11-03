/* scripts.js - Products + search + modal + forms
   Uses Unsplash for demo images (no local images required).
*/

/* Product list (Falcon 9mm & Predator rifle + extras) */
const productsData = [
  { id: 'falcon-9mm', name: 'Falcon Pistol 9mm', type: 'Pistol', price: 14500, short: 'Reliable 9mm pistol suitable for protection and sport shooting.', imageKeyword: '9mm pistol' },
  { id: 'predator-rifle', name: 'Predator Hunting Rifle', type: 'Rifle', price: 36500, short: 'High-precision hunting rifle for long-range accuracy.', imageKeyword: 'hunting rifle' },
  { id: 'sentra-shotgun', name: 'Sentra Tactical Shotgun', type: 'Shotgun', price: 22000, short: 'Versatile tactical shotgun.', imageKeyword: 'shotgun' },
  { id: 'predator-kit', name: 'Predator Range Kit', type: 'Kit', price: 1200, short: 'Ear protection, targets and cleaning kit.', imageKeyword: 'shooting range targets' },
  { id: 'tactical-pack', name: 'Tactical Gear Pack', type: 'Accessory', price: 3200, short: 'Backpack and protective gear for field and range use.', imageKeyword: 'tactical gear backpack' }
];

/* Helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function unsplashURL(keyword, w=800, h=600) {
  return 'https://source.unsplash.com/' + w + 'x' + h + '/?' + encodeURIComponent(keyword);
}

/* Render a list into a container (used for featured and products grid) */
function renderProducts(containerSelector, items) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(p => {
    const img = unsplashURL(p.imageKeyword, 800, 600);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img class="product-img" src="${img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="small">${p.short}</p>
      <div class="bottom-row">
        <div class="price">R ${p.price.toLocaleString()}</div>
        <div>
          <button class="btn btn-buy" data-id="${p.id}">Buy</button>
          <button class="btn secondary btn-details" data-id="${p.id}">Details</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // attach button listeners
  $$('.btn-details').forEach(btn => btn.addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.id;
    const product = productsData.find(x => x.id === id);
    openProductModal(product);
  }));

  $$('.btn-buy').forEach(btn => btn.addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.id;
    const product = productsData.find(x => x.id === id);
    alert(`Demo: Selected ${product.name} — Price: R ${product.price.toLocaleString()}`);
  }));
}

/* Modal */
function openProductModal(product) {
  if (!product) return;
  let modal = $('#product-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.innerHTML = `<div class="inner" id="modal-inner"></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  }
  const inner = $('#modal-inner');
  const img = unsplashURL(product.imageKeyword, 1200, 900);
  inner.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 320px;gap:12px">
      <div><img src="${img}" alt="${product.name}" style="width:100%;border-radius:8px"></div>
      <div>
        <h2>${product.name}</h2>
        <p class="small">${product.short}</p>
        <p class="price">R ${product.price.toLocaleString()}</p>
        <p class="small"><strong>Type:</strong> ${product.type}</p>
        <div style="margin-top:12px">
          <button class="btn" id="modal-buy">Buy</button>
          <button class="btn secondary" id="modal-close">Close</button>
        </div>
      </div>
    </div>
  `;
  $('#modal-close')?.addEventListener('click', () => { modal.style.display = 'none'; });
  $('#modal-buy')?.addEventListener('click', () => {
    alert(`Email info@sentrafirearms.co.za to purchase ${product.name}`);
  });
  modal.style.display = 'flex';
}

/* Filter logic */
function filterProducts(q) {
  q = (q || '').toString().trim().toLowerCase();
  if (!q) {
    renderProducts('#products-list', productsData);  // products page list
    renderProducts('#featured-list', productsData.slice(0,3)); // featured on home
    return;
  }
  const filtered = productsData.filter(p => {
    return p.name.toLowerCase().includes(q)
      || p.type.toLowerCase().includes(q)
      || p.short.toLowerCase().includes(q)
      || p.id.toLowerCase().includes(q);
  });
  renderProducts('#products-list', filtered);
  renderProducts('#featured-list', filtered.slice(0,3));
}

/* Setup search handlers for both hero and products page */
function setupSearchHandlers() {
  const heroInput = $('#hero-search');
  const heroBtn = $('#hero-search-btn');
  const pageInput = $('#product-search');
  const pageBtn = $('#product-search-btn');

  // hero search (on index)
  if (heroInput) {
    heroInput.addEventListener('input', () => { /* optional live */ });
    heroInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); filterProducts(this.value); window.location.href = 'products.html'; }});
    if (heroBtn) heroBtn.addEventListener('click', function(){ const v = heroInput.value; window.location.href = 'products.html?q=' + encodeURIComponent(v); });
  }

  // products page search
  if (pageInput) {
    pageInput.addEventListener('input', function(){ filterProducts(this.value); });
    pageInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); filterProducts(this.value); }});
    if (pageBtn) pageBtn.addEventListener('click', function(){ filterProducts(pageInput.value); pageInput.focus(); });
    // prevent form submits if inside a form
    const parent = pageInput.closest && pageInput.closest('form');
    if (parent) parent.addEventListener('submit', e => e.preventDefault());
  }
}

/* Enquiry / contact behaviours */
function setupContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();
    if (!name || !email || !message) { alert('Please complete all fields.'); return; }
    window.location.href = 'mailto:info@sentrafirearms.co.za?subject=' + encodeURIComponent('Contact from ' + name) + '&body=' + encodeURIComponent(message + '\n\n' + email);
  });
}

function setupEnquiryForm() {
  const form = $('#enquiry-form');
  if (!form) return;
  const select = $('#enq-product');
  if (select) {
    select.innerHTML = '<option value="">Select a product</option>' + productsData.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = $('#enq-name').value.trim();
    const email = $('#enq-email').value.trim();
    const prodId = $('#enq-product').value;
    const qty = parseInt($('#enq-qty').value || '0', 10);
    const urgency = $('#enq-urgency').value || 'normal';
    if (!name || !email || !prodId || !qty || qty < 1) { alert('Please complete all fields correctly.'); return; }
    const product = productsData.find(p => p.id === prodId);
    let base = product.price * qty;
    if (urgency === 'express') base = Math.round(base * 1.15);
    if (qty >= 10) base = Math.round(base * 0.92);
    const availability = qty <= 5 ? 'In stock' : (qty <= 20 ? 'Available on request' : 'Special order - allow 2-3 weeks');
    const result = `Thanks ${name}. Estimated cost for ${qty} x ${product.name}: R ${base.toLocaleString()}. Availability: ${availability}.`;
    let out = form.querySelector('.enq-result');
    if (!out) { out = document.createElement('div'); out.className='enq-result small'; form.appendChild(out); }
    out.textContent = result;
  });
}

/* Init */
document.addEventListener('DOMContentLoaded', function(){
  // If the products page received a query param, pre-fill search
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  renderProducts('#products-list', productsData);
  renderProducts('#featured-list', productsData.slice(0,3));
  setupSearchHandlers();
  setupContactForm();
  setupEnquiryForm();
  if (q) {
    const pageInput = $('#product-search');
    if (pageInput) { pageInput.value = q; pageInput.focus(); filterProducts(q); }
  }
});