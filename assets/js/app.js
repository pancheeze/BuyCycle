'use strict';

const fallbackProducts = [
    {
        id: 'bc-001',
        name: 'AeroPro Carbon Wheelset',
        price: 1299.99,
        category: 'Components',
        brand: 'AeroPro',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1487139975590-b4f1dce9b035?auto=format&fit=crop&w=900&q=80',
        description: 'Lightweight 45mm carbon rims optimized for all-weather performance.'
    },
    {
        id: 'bc-002',
        name: 'TrailMaster Suspension Fork',
        price: 749.5,
        category: 'Components',
        brand: 'TrailMaster',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
        description: '140mm travel with adjustable rebound ideal for aggressive trail riding.'
    },
    {
        id: 'bc-003',
        name: 'Summit Elite Helmet',
        price: 189.99,
        category: 'Accessories',
        brand: 'Summit',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1542293787938-4d2226afd5c0?auto=format&fit=crop&w=900&q=80',
        description: 'Breathable MIPS helmet with magnetic buckle and integrated rear light.'
    },
    {
        id: 'bc-004',
        name: 'RideEase Performance Saddle',
        price: 129.0,
        category: 'Components',
        brand: 'RideEase',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80',
        description: 'Ergonomic cutout saddle designed to reduce pressure on long rides.'
    },
    {
        id: 'bc-005',
        name: 'Tempo Precision Cycling Shoes',
        price: 259.99,
        category: 'Apparel',
        brand: 'Tempo',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1577640962370-3a77c07a9d83?auto=format&fit=crop&w=900&q=80',
        description: 'Dual BOA dial closure for tailored fit and stiff carbon-reinforced sole.'
    },
    {
        id: 'bc-006',
        name: 'GlowRide Smart Light Set',
        price: 89.5,
        category: 'Accessories',
        brand: 'GlowRide',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1532292060982-8bfb98680891?auto=format&fit=crop&w=900&q=80',
        description: 'USB-rechargeable front and rear lights with adaptive brightness sensors.'
    },
    {
        id: 'bc-007',
        name: 'ClimbPro Multi-Tool Kit',
        price: 59.99,
        category: 'Accessories',
        brand: 'ClimbPro',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80',
        description: '18-function stainless multi-tool with tubeless repair plugs.'
    },
    {
        id: 'bc-008',
        name: 'HydroFlow Endurance Bottle',
        price: 24.0,
        category: 'Accessories',
        brand: 'HydroFlow',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=900&q=80',
        description: 'Insulated bottle keeps drinks cold up to 4 hours with quick-squeeze valve.'
    },
    {
        id: 'bc-009',
        name: 'PulseSync Heart Rate Monitor',
        price: 129.99,
        category: 'Accessories',
        brand: 'PulseSync',
        rating: 4.1,
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
        description: 'ANT+/Bluetooth heart rate sensor compatible with major cycling computers.'
    },
    {
        id: 'bc-010',
        name: 'Element Windproof Jacket',
        price: 139.5,
        category: 'Apparel',
        brand: 'Element',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        description: 'Packable windproof shell with reflective accents and breathable panels.'
    }
];

const state = {
    products: [],
    filters: {
        category: 'all',
        search: ''
    },
    cart: new Map()
};

const els = {
    categoryGrid: document.querySelector('[data-category-grid]'),
    productGrid: document.querySelector('[data-product-grid]'),
    emptyState: document.querySelector('[data-empty-state]'),
    categoryFilter: document.querySelector('[data-filter-category]'),
    searchInput: document.querySelector('[data-filter-search]'),
    cartCount: document.querySelector('[data-cart-count]'),
    cartPanel: document.querySelector('[data-cart-panel]'),
    cartItems: document.querySelector('[data-cart-items]'),
    cartTotal: document.querySelector('[data-cart-total]'),
    cartToggleButtons: document.querySelectorAll('[data-cart-toggle]'),
    toast: document.querySelector('[data-toast]'),
    yearSpan: document.querySelector('[data-current-year]'),
    newsletterForm: document.querySelector('[data-newsletter-form]')
};

// Load saved cart from localStorage for persistence across visits.
function loadCart() {
    const raw = window.localStorage.getItem('buycycle-cart');
    if (!raw) return;
    try {
        const entries = JSON.parse(raw);
        entries.forEach(([key, value]) => state.cart.set(key, value));
    } catch (error) {
        console.warn('Failed to restore cart', error);
        state.cart.clear();
    }
}

function persistCart() {
    const payload = JSON.stringify(Array.from(state.cart.entries()));
    window.localStorage.setItem('buycycle-cart', payload);
}

async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        state.products = Array.isArray(products) && products.length ? products : fallbackProducts;
    } catch (error) {
        console.info('Falling back to bundled product data.', error);
        state.products = fallbackProducts;
    }
}

function uniqueCategories() {
    const categories = new Set(state.products.map(product => product.category));
    return Array.from(categories).sort();
}

function renderCategories() {
    if (!els.categoryGrid) return;
    els.categoryGrid.innerHTML = '';
    uniqueCategories().forEach(category => {
        const count = state.products.filter(product => product.category === category).length;
        const card = document.createElement('button');
        card.className = 'category-card';
        card.type = 'button';
        card.innerHTML = `<span>🚴‍♂️</span><span>${category}</span><span>${count} items</span>`;
        card.addEventListener('click', () => {
            state.filters.category = category;
            els.categoryFilter.value = category;
            renderProductGrid();
        });
        els.categoryGrid.appendChild(card);
    });
}

function configureCategoryFilter() {
    els.categoryFilter.innerHTML = '<option value="all">All</option>';
    uniqueCategories().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        els.categoryFilter.appendChild(option);
    });
}

function matchFilters(product) {
    const matchesCategory = state.filters.category === 'all' || product.category === state.filters.category;
    const query = state.filters.search.trim().toLowerCase();
    const matchesSearch = !query || [product.name, product.brand, product.description]
        .some(field => field.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
}

function renderProductGrid() {
    if (!els.productGrid) return;
    els.productGrid.innerHTML = '';
    const filtered = state.products.filter(matchFilters);
    if (!filtered.length) {
        els.emptyState.hidden = false;
        return;
    }
    els.emptyState.hidden = true;

    filtered.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.tabIndex = 0;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-content">
                <span class="product-title">${product.name}</span>
                <div class="product-meta">
                    <span>${product.brand}</span>
                    <span>⭐ ${product.rating.toFixed(1)}</span>
                </div>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to cart</button>
                </div>
            </div>
        `;
        els.productGrid.appendChild(card);
    });

    els.productGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const { productId } = event.currentTarget.dataset;
            addToCart(productId);
        });
    });
}

function addToCart(productId) {
    const product = state.products.find(item => item.id === productId);
    if (!product) return;
    const existing = state.cart.get(productId);
    if (existing) {
        existing.quantity += 1;
        state.cart.set(productId, existing);
    } else {
        state.cart.set(productId, {
            product,
            quantity: 1
        });
    }
    persistCart();
    renderCart();
    showToast(`${product.name} added to cart.`);
}

function updateCartCount() {
    const totalItems = Array.from(state.cart.values())
        .reduce((sum, entry) => sum + entry.quantity, 0);
    els.cartCount.textContent = totalItems;
}

function renderCart() {
    if (!els.cartItems) return;
    els.cartItems.innerHTML = '';
    if (!state.cart.size) {
        els.cartItems.innerHTML = '<p class="cart-empty">Your cart is empty. Start shopping to add products.</p>';
        updateCartCount();
        els.cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    state.cart.forEach(({ product, quantity }, productId) => {
        total += product.price * quantity;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
                <strong>${product.name}</strong>
                <span>$${product.price.toFixed(2)}</span>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button type="button" data-action="decrease">-</button>
                    <span>${quantity}</span>
                    <button type="button" data-action="increase">+</button>
                </div>
                <button class="remove-item" type="button">Remove</button>
            </div>
        `;
        row.querySelector('[data-action="decrease"]').addEventListener('click', () => changeQuantity(productId, -1));
        row.querySelector('[data-action="increase"]').addEventListener('click', () => changeQuantity(productId, 1));
        row.querySelector('.remove-item').addEventListener('click', () => removeFromCart(productId));
        els.cartItems.appendChild(row);
    });

    els.cartTotal.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

function changeQuantity(productId, delta) {
    const entry = state.cart.get(productId);
    if (!entry) return;
    entry.quantity += delta;
    if (entry.quantity <= 0) {
        state.cart.delete(productId);
    } else {
        state.cart.set(productId, entry);
    }
    persistCart();
    renderCart();
}

function removeFromCart(productId) {
    if (!state.cart.has(productId)) return;
    state.cart.delete(productId);
    persistCart();
    renderCart();
}

function toggleCart() {
    const isOpen = els.cartPanel.getAttribute('data-open') === 'true';
    els.cartPanel.setAttribute('data-open', String(!isOpen));
    els.cartPanel.setAttribute('aria-hidden', String(isOpen));
}

function configureCartToggle() {
    els.cartToggleButtons.forEach(button => {
        button.addEventListener('click', toggleCart);
    });
}

function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.hidden = false;
    els.toast.setAttribute('data-visible', 'true');
    setTimeout(() => {
        els.toast.removeAttribute('data-visible');
        els.toast.hidden = true;
    }, 2400);
}

function configureFilters() {
    els.categoryFilter.addEventListener('change', event => {
        state.filters.category = event.target.value;
        renderProductGrid();
    });
    els.searchInput.addEventListener('input', event => {
        state.filters.search = event.target.value;
        renderProductGrid();
    });
}

function configureNewsletterForm() {
    if (!els.newsletterForm) return;
    els.newsletterForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        showToast(`Thanks ${email}, welcome to BuyCycle!`);
        event.target.reset();
    });
}

function setCurrentYear() {
    if (!els.yearSpan) return;
    els.yearSpan.textContent = new Date().getFullYear();
}

async function bootstrap() {
    loadCart();
    await loadProducts();
    configureCategoryFilter();
    renderCategories();
    renderProductGrid();
    renderCart();
    configureFilters();
    configureCartToggle();
    configureNewsletterForm();
    setCurrentYear();
}

document.addEventListener('DOMContentLoaded', bootstrap);
