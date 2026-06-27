// ==============================================
// Relief3D — Navigation, Modal & Language Module
// ==============================================

// --- Language Management ---
function getLang() {
    return localStorage.getItem('preferredLanguage') || 
        ((navigator.language || '').toLowerCase().includes('uk') ? 'ua' : 'en');
}

function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    document.querySelectorAll('.lang-ua').forEach(el => el.style.display = lang === 'ua' ? '' : 'none');
    document.querySelectorAll('.lang-en').forEach(el => el.style.display = lang === 'en' ? '' : 'none');
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // Re-render catalog if present
    if (typeof renderCatalog === 'function' && document.getElementById('portfolio')) {
        const catFilter = document.getElementById('portfolio').dataset.category || null;
        renderCatalog('portfolio', catFilter, lang);
    }
    if (typeof renderCatalog === 'function' && document.getElementById('catalog-grid')) {
        const activeFilter = document.querySelector('.filter-btn.active');
        const cat = activeFilter ? activeFilter.dataset.cat : null;
        renderCatalog('catalog-grid', cat, lang);
    }
}

// --- Header Builder ---
function buildHeader(activePage) {
    const root = getRootPath();
    const lang = getLang();
    const header = document.getElementById('site-header');
    if (!header) return;

    header.innerHTML = `
        <a href="${root}/index.html" class="logo">RELIEF3D.</a>
        <div class="nav-center">
            <div class="nav-dropdown">
                <a href="${root}/catalog/index.html" class="nav-link ${activePage === 'catalog' ? 'active' : ''}">
                    <span class="lang-ua">Каталог</span><span class="lang-en">Catalog</span>
                    <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </a>
                <div class="dropdown-menu">
                    ${Object.values(CATEGORIES).map(cat => `
                        <a href="${root}/category/${cat.slug}/index.html" class="dropdown-item">
                            <span class="cat-icon">${cat.icon}</span>
                            <div>
                                <div class="dropdown-title">
                                    <span class="lang-ua">${cat.title.ua}</span>
                                    <span class="lang-en">${cat.title.en}</span>
                                </div>
                                <div class="dropdown-desc">
                                    <span class="lang-ua">${cat.desc.ua}</span>
                                    <span class="lang-en">${cat.desc.en}</span>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="nav-right">
            <div class="lang-switcher">
                <button class="lang-btn" data-lang="ua" onclick="setLanguage('ua')">UA</button>
                <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
            </div>
            <button class="burger-btn" id="burgerBtn" onclick="toggleMobileMenu()">
                <span></span><span></span><span></span>
            </button>
        </div>
    `;

    // Mobile menu overlay
    const overlay = document.createElement('div');
    overlay.id = 'mobileMenu';
    overlay.className = 'mobile-menu';
    overlay.innerHTML = `
        <button class="mobile-close" onclick="toggleMobileMenu()">✕</button>
        <a href="${root}/index.html" class="mobile-link"><span class="lang-ua">Головна</span><span class="lang-en">Home</span></a>
        <a href="${root}/catalog/index.html" class="mobile-link"><span class="lang-ua">Каталог</span><span class="lang-en">Catalog</span></a>
        <div class="mobile-divider"></div>
        ${Object.values(CATEGORIES).map(cat => `
            <a href="${root}/category/${cat.slug}/index.html" class="mobile-link mobile-cat-link">
                ${cat.icon} <span class="lang-ua">${cat.title.ua}</span><span class="lang-en">${cat.title.en}</span>
            </a>
        `).join('')}
    `;
    document.body.appendChild(overlay);
    applyLanguage(lang);
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
    document.body.classList.toggle('no-scroll');
}

// --- Modal ---
function openModal(item, lang) {
    const root = getRootPath();
    const currentLang = lang || getLang();
    let modal = document.getElementById('relief-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'relief-modal';
        modal.className = 'modal';
        modal.onclick = e => { if (e.target === modal) closeModal(); };
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn" onclick="closeModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="modal-img-container">
                <img src="${root}${item.img}" alt="${item.title[currentLang]}" class="modal-img">
            </div>
            <div class="modal-info">
                <h2 class="modal-title">${item.title[currentLang]}</h2>
                <p class="modal-desc">${item.desc[currentLang]}</p>
                <div class="modal-specs">
                    <span>📐 ${item.size}</span>
                    <span>🎨 ${item.finish}</span>
                </div>
                <a href="#" class="order-btn" onclick="alert('${currentLang === 'ua' ? 'Форма замовлення незабаром!' : 'Order form coming soon!'}'); return false;">
                    ${currentLang === 'ua' ? 'Зробити замовлення' : 'Place an Order'}
                </a>
            </div>
        </div>
    `;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('relief-modal');
    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Apply lang on init
document.addEventListener('DOMContentLoaded', () => applyLanguage(getLang()));
