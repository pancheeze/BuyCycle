'use strict';

const PRODUCTS_ENDPOINT = 'data/products.json';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80';

const CATEGORY_CONFIG = [
    { value: 'Drivetrain', label: 'Drivetrain', badge: 'DR' },
    { value: 'Wheelsets', label: 'Wheelsets', badge: 'WH' },
    { value: 'Brakes', label: 'Brakes', badge: 'BR' },
    { value: 'Suspension', label: 'Suspension', badge: 'SU' },
    { value: 'Contact Points', label: 'Contact Points', badge: 'CP' },
    { value: 'Lighting', label: 'Lighting', badge: 'LG' },
    { value: 'Electronics', label: 'Electronics', badge: 'EL' },
    { value: 'Tools', label: 'Tools', badge: 'TL' },
    { value: 'Apparel', label: 'Apparel', badge: 'AP' },
    { value: 'Accessories', label: 'Accessories', badge: 'AC' },
    { value: 'Tires', label: 'Tires', badge: 'TR' },
    { value: 'Training', label: 'Training', badge: 'TN' }
];

const fallbackProducts = [
    {
        id: 'drv-001',
        name: 'Shimano Ultegra R8000 Crankset',
        price: 289.99,
        category: 'Drivetrain',
        brand: 'Shimano',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1525104698733-6ecfbfbaf2df?auto=format&fit=crop&w=900&q=80',
        description: 'Hollowtech II 52/36T crankset that balances stiffness and lightweight efficiency for road riding.'
    },
    {
        id: 'drv-002',
        name: 'SRAM GX Eagle 12-Speed Cassette',
        price: 229.0,
        category: 'Drivetrain',
        brand: 'SRAM',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1518292583750-f0b6f86f77cd?auto=format&fit=crop&w=900&q=80',
        description: '10-52T cassette with full XD driver compatibility and wide-range gearing for trail bikes.'
    },
    {
        id: 'wls-001',
        name: 'DT Swiss ERC 1400 Dicut Wheelset',
        price: 1899.99,
        category: 'Wheelsets',
        brand: 'DT Swiss',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1605719124117-0406238b5994?auto=format&fit=crop&w=900&q=80',
        description: 'Tubeless-ready carbon wheels with 45 mm rims designed for fast endurance rides and crosswinds.'
    },
    {
        id: 'brk-001',
        name: 'SRAM G2 RSC Disc Brake Set',
        price: 289.5,
        category: 'Brakes',
        brand: 'SRAM',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1517840545246-b491010a9e11?auto=format&fit=crop&w=900&q=80',
        description: 'Four-piston trail brakes featuring contact point adjustment and SwingLink lever feel.'
    },
    {
        id: 'sus-001',
        name: 'Fox Factory 34 Step-Cast Fork',
        price: 969.0,
        category: 'Suspension',
        brand: 'Fox',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc1?auto=format&fit=crop&w=900&q=80',
        description: '120 mm travel XC fork with FIT4 damper, Kashima coating, and lightweight Step-Cast chassis.'
    },
    {
        id: 'sat-001',
        name: 'Specialized Power Expert Saddle',
        price: 159.99,
        category: 'Contact Points',
        brand: 'Specialized',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1595433707802-8f4b64d45e85?auto=format&fit=crop&w=900&q=80',
        description: 'Short-nose saddle with Body Geometry cutout to support aggressive road and gravel positions.'
    },
    {
        id: 'lit-001',
        name: 'Bontrager Ion Elite R Front Light',
        price: 119.99,
        category: 'Lighting',
        brand: 'Bontrager',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1517003211561-e9f26837fef0?auto=format&fit=crop&w=900&q=80',
        description: '1000-lumen USB-C rechargeable light with Daytime Running Mode for city commuting.'
    },
    {
        id: 'ele-001',
        name: 'Garmin Edge 840 Solar',
        price: 549.99,
        category: 'Electronics',
        brand: 'Garmin',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        description: 'Performance GPS computer with solar charging, ClimbPro, and multi-band GNSS accuracy.'
    },
    {
        id: 'tls-001',
        name: 'Park Tool AK-5 Advanced Mechanic Toolkit',
        price: 319.95,
        category: 'Tools',
        brand: 'Park Tool',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1595435905940-c6ef1debd5a5?auto=format&fit=crop&w=900&q=80',
        description: 'A 40-piece kit covering essential shop-quality tools for drivetrain, wheel, and brake service.'
    },
    {
        id: 'app-001',
        name: 'Rapha Core Cycling Jersey',
        price: 95.0,
        category: 'Apparel',
        brand: 'Rapha',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=900&q=80',
        description: 'Breathable jersey with twin stripe detailing, optimized for everyday training miles.'
    },
    {
        id: 'acc-001',
        name: 'CamelBak Podium Chill 21oz Bottle',
        price: 16.0,
        category: 'Accessories',
        brand: 'CamelBak',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1600181952022-2bd5ead43a6c?auto=format&fit=crop&w=900&q=80',
        description: 'Double-wall insulated cycling bottle with high-flow Jet Valve and secure lockout.'
    },
    {
        id: 'tyr-001',
        name: 'Maxxis Minion DHF 29x2.5 WT Tire',
        price: 77.99,
        category: 'Tires',
        brand: 'Maxxis',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80',
        description: '3C MaxxTerra compound tire with EXO protection for confident enduro and trail grip.'
    },
    {
        id: 'prn-001',
        name: 'Elite Direto XR-T Smart Trainer',
        price: 999.0,
        category: 'Training',
        brand: 'Elite',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1595433562696-19f5c4f0b264?auto=format&fit=crop&w=900&q=80',
        description: 'Direct-drive smart trainer with ±1.5% accuracy and 2300-watt sprint resistance for indoor sessions.'
    }
];

function sanitizeDescription(rawDescription) {
    if (!rawDescription) return 'No description provided.';
    let text = rawDescription;
    if (typeof rawDescription !== 'string') {
        try {
            text = JSON.stringify(rawDescription);
        } catch (error) {
            return 'No description provided.';
        }
    }

    const temp = document.createElement('div');
    temp.innerHTML = text;
    const stripped = (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
    if (!stripped) return 'No description provided.';
    return stripped.length > 220 ? `${stripped.slice(0, 217)}...` : stripped;
}

function normalizeProduct(entry, index) {
    if (!entry) return null;

    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    if (!name) return null;

    const priceValue = Number(entry.price);
    if (!Number.isFinite(priceValue) || priceValue < 0) return null;

    const category = typeof entry.category === 'string' && entry.category.trim()
        ? entry.category.trim()
        : 'Accessories';

    const brand = typeof entry.brand === 'string' && entry.brand.trim()
        ? entry.brand.trim()
        : 'Independent';

    const ratingValue = Number(entry.rating);
    const rating = Number.isFinite(ratingValue) ? Math.min(5, Math.max(1, ratingValue)) : 4.5;

    const image = typeof entry.image === 'string' && entry.image.trim()
        ? entry.image.trim()
        : FALLBACK_IMAGE;

    return {
        id: String(entry.id || `product-${index}`),
        name,
        price: priceValue,
        category,
        brand,
        rating,
        image,
        description: sanitizeDescription(entry.description)
    };
}

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
    newsletterForm: document.querySelector('[data-newsletter-form]'),
    accountMenu: document.querySelector('[data-account-menu]'),
    accountToggle: document.querySelector('[data-account-toggle]'),
    accountDropdown: document.querySelector('[data-account-dropdown]'),
    accountActions: document.querySelectorAll('[data-account-action]'),
    accountLabel: document.querySelector('[data-account-label]'),
    authGate: document.querySelector('[data-auth-gate]'),
    authGateTabs: document.querySelectorAll('[data-gate-tab]'),
    authGateForms: document.querySelectorAll('[data-gate-form]')
};

const AUTH_STORAGE_KEY = 'buycycle-authenticated';
const AUTH_EMAIL_KEY = 'buycycle-auth-email';

function refreshAccountLabel() {
    if (!els.accountLabel) return;
    const email = window.sessionStorage.getItem(AUTH_EMAIL_KEY);
    els.accountLabel.textContent = email && email.trim() ? email : 'Account';
}

function activateAuthGate(target) {
    if (!els.authGateTabs.length || !els.authGateForms.length) return;
    const desired = target || 'signin';
    els.authGateTabs.forEach(tab => {
        const isActive = tab.dataset.gateTab === desired;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
    els.authGateForms.forEach(form => {
        const isActive = form.dataset.gateForm === desired;
        form.classList.toggle('active', isActive);
        form.setAttribute('aria-hidden', String(!isActive));
    });
}

function closeAccountMenu() {
    if (!els.accountMenu) return;
    els.accountMenu.classList.remove('open');
    if (els.accountToggle) {
        els.accountToggle.setAttribute('aria-expanded', 'false');
    }
}

function handleAccountAction(action) {
    if (action !== 'logout' && action !== 'switch') return;
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_EMAIL_KEY);
    closeAccountMenu();
    els.authGateForms.forEach(form => form.reset());
    activateAuthGate('signin');
    applyAuthState(false);
}

function configureAccountMenu() {
    if (!els.accountMenu || !els.accountToggle || !els.accountDropdown) return;
    els.accountToggle.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = els.accountMenu.classList.toggle('open');
        els.accountToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', event => {
        if (!els.accountMenu.contains(event.target)) {
            closeAccountMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeAccountMenu();
        }
    });

    els.accountActions.forEach(button => {
        button.addEventListener('click', () => handleAccountAction(button.dataset.accountAction));
    });
}

function applyAuthState(isAuthenticated) {
    document.body.dataset.authenticated = String(isAuthenticated);
    refreshAccountLabel();
    if (!els.authGate) return;
    if (isAuthenticated) {
        els.authGate.setAttribute('hidden', 'true');
        closeAccountMenu();
    } else {
        els.authGate.removeAttribute('hidden');
        requestAnimationFrame(() => {
            const firstInput = els.authGate.querySelector('input');
            if (firstInput) firstInput.focus();
        });
    }
}

function configureAuthGate() {
    if (!els.authGate) {
        applyAuthState(true);
        return;
    }

    const stored = window.sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    applyAuthState(stored);

    els.authGateTabs.forEach(tab => {
        tab.addEventListener('click', () => activateAuthGate(tab.dataset.gateTab));
    });

    els.authGateForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const password = form.querySelector('[name="password"]');
            const confirm = form.querySelector('[name="confirm"]');
            if (confirm && password && confirm.value !== password.value) {
                confirm.setCustomValidity('Passwords do not match');
                confirm.reportValidity();
                confirm.addEventListener('input', () => confirm.setCustomValidity(''), { once: true });
                return;
            }

            const formData = new FormData(form);
            const email = String(formData.get('email') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const intent = form.dataset.gateForm;
            const message = intent === 'signin'
                ? (email ? `Welcome back, ${email}!` : 'Welcome back!')
                : `Account created for ${email || 'customer'}${phone ? ` (${phone})` : ''}.`;

            form.reset();
            if (email) {
                window.sessionStorage.setItem(AUTH_EMAIL_KEY, email);
            } else {
                window.sessionStorage.removeItem(AUTH_EMAIL_KEY);
            }
            window.sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
            applyAuthState(true);
            showToast(message);
        });
    });

    activateAuthGate('signin');
}

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
        const response = await fetch(PRODUCTS_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to load ${PRODUCTS_ENDPOINT}: ${response.status}`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
            ? payload.map((entry, index) => normalizeProduct(entry, index)).filter(Boolean)
            : [];

        if (!normalized.length) {
            throw new Error('Products dataset did not contain usable entries.');
        }

        state.products = normalized;
    } catch (error) {
        console.info('Falling back to inline product data.', error);
        const normalizedFallback = fallbackProducts
            .map((entry, index) => normalizeProduct(entry, index))
            .filter(Boolean);
        state.products = normalizedFallback.length ? normalizedFallback : fallbackProducts.slice();
    }
}

function getCategorySummaries() {
    const counts = new Map();
    state.products.forEach(product => {
        const key = product.category || 'Accessories';
        counts.set(key, (counts.get(key) || 0) + 1);
    });

    const configuredMap = new Map(CATEGORY_CONFIG.map(item => [item.value, item]));
    const summaries = [];

    summaries.push({
        value: 'all',
        label: 'All Categories',
        badge: 'ALL',
        count: state.products.length
    });

    CATEGORY_CONFIG.forEach(item => {
        if (counts.has(item.value)) {
            summaries.push({
                value: item.value,
                label: item.label,
                badge: item.badge,
                count: counts.get(item.value)
            });
        }
    });

    const extras = Array.from(counts.keys()).filter(category => !configuredMap.has(category));
    extras.sort((a, b) => a.localeCompare(b));
    extras.forEach(category => {
        summaries.push({
            value: category,
            label: category,
            badge: category.slice(0, 2).toUpperCase(),
            count: counts.get(category)
        });
    });

    return summaries;
}

function setActiveCategory(value, options = {}) {
    const target = value && value !== '' ? value : 'all';
    state.filters.category = target;

    if (els.categoryFilter) {
        els.categoryFilter.value = target;
    }

    renderCategories();
    renderProductGrid();

    if (options.scroll && els.productGrid) {
        els.productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderCategories() {
    if (!els.categoryGrid) return;
    const summaries = getCategorySummaries();
    els.categoryGrid.innerHTML = '';

    summaries.forEach(({ value, label, badge, count }) => {
        const card = document.createElement('button');
        card.className = 'category-card';
        card.type = 'button';
        const isActive = state.filters.category === value;
        if (isActive) {
            card.classList.add('active');
        }
        card.setAttribute('data-category-value', value);
        card.setAttribute('aria-pressed', String(isActive));
        card.setAttribute('aria-current', String(isActive));
        const noun = count === 1 ? 'item' : 'items';
        const badgeSpan = document.createElement('span');
        badgeSpan.textContent = badge;
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        const countSpan = document.createElement('span');
        countSpan.textContent = `${count} ${noun}`;
        card.append(badgeSpan, labelSpan, countSpan);
        card.setAttribute('aria-label', `${label} (${count} ${noun})`);
        card.addEventListener('click', () => setActiveCategory(value, { scroll: true }));
        els.categoryGrid.appendChild(card);
    });
}

function configureCategoryFilter() {
    if (!els.categoryFilter) return;
    els.categoryFilter.innerHTML = '';

    getCategorySummaries().forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        els.categoryFilter.appendChild(option);
    });

    els.categoryFilter.value = state.filters.category;
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
        const ratingValue = typeof product.rating === 'number' ? product.rating : 4.0;
        const card = document.createElement('article');
        card.className = 'product-card';
        card.tabIndex = 0;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-content">
                <span class="product-title">${product.name}</span>
                <div class="product-meta">
                    <span>${product.brand}</span>
                    <span>⭐ ${ratingValue.toFixed(1)}</span>
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
    if (els.cartCount) {
        els.cartCount.textContent = totalItems;
    }
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
    if (!els.cartPanel) return;
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
    if (els.categoryFilter) {
        els.categoryFilter.addEventListener('change', event => {
            setActiveCategory(event.target.value, { scroll: false });
        });
    }
    if (els.searchInput) {
        els.searchInput.addEventListener('input', event => {
            state.filters.search = event.target.value;
            renderProductGrid();
        });
    }
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
    configureAuthGate();
    configureAccountMenu();
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
