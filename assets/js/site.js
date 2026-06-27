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
                <a href="${root}/product/${item.id}/index.html" class="order-btn">
                    ${currentLang === 'ua' ? 'Детальніше' : 'View Details'}
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

// --- Lightbox for Zoomable Images ---
function openLightbox(src) {
    let lb = document.getElementById('lightbox-modal');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'lightbox-modal';
        lb.className = 'lightbox-modal';
        lb.innerHTML = `
            <button class="lightbox-close">✕</button>
            <img src="" alt="Zoomed Image">
        `;
        document.body.appendChild(lb);
        
        lb.addEventListener('click', (e) => {
            if (e.target === lb || e.target.classList.contains('lightbox-close')) {
                lb.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    lb.querySelector('img').src = src;
    lb.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function initLightbox() {
    document.querySelectorAll('img.zoomable').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src));
    });
}

// --- Interactive Product Page Materials Showcase ---
function initProductPage() {
    const pathParts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
    const prodIndex = pathParts.indexOf('product');
    if (prodIndex === -1 || prodIndex === pathParts.length - 1) return;
    const productId = pathParts[prodIndex + 1];
    
    const product = CATALOG.find(p => p.id === productId);
    if (!product || !product.materials) return;
    
    const cardMaterials = document.querySelector('.card-materials');
    if (!cardMaterials) return;
    
    const root = getRootPath();
    const lang = getLang();
    
    const row = cardMaterials.querySelector('.materials-row');
    const img = cardMaterials.querySelector('img');
    if (!row || !img) return;
    
    row.innerHTML = product.materials.map(matKey => {
        const mat = MATERIALS[matKey];
        if (!mat) return '';
        return `
            <div class="mat-badge" data-material="${matKey}" style="cursor: pointer; transition: all var(--transition);">
                <div class="mat-dot" style="background: ${mat.color};"></div>
                <span class="lang-ua">${mat.name.ua}</span>
                <span class="lang-en">${mat.name.en}</span>
            </div>
        `;
    }).join('');
    
    const badges = row.querySelectorAll('.mat-badge');
    badges.forEach((badge, idx) => {
        badge.addEventListener('click', () => {
            badges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
            const matKey = badge.dataset.material;
            // Clean up leading slash from path to make it relative and safe locally/on subpaths
            const cleanPath = MATERIALS[matKey].img.replace(/^\//, '');
            img.src = root + '/' + cleanPath;
        });
        
        if (idx === 0) {
            badge.classList.add('active');
            const cleanPath = MATERIALS[badge.dataset.material].img.replace(/^\//, '');
            img.src = root + '/' + cleanPath;
        }
    });
    
    applyLanguage(lang);
}

// --- Image Slider/Carousel ---
function initCarousels() {
    document.querySelectorAll('.carousel-container').forEach(container => {
        const slides = container.querySelectorAll('.carousel-slides img');
        const dotsContainer = container.querySelector('.carousel-dots');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        if (slides.length <= 1) return;
        
        let activeIdx = 0;
        
        if (dotsContainer) {
            dotsContainer.innerHTML = Array.from(slides).map((_, idx) => 
                `<span class="dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>`
            ).join('');
        }
        
        const dots = container.querySelectorAll('.carousel-dots .dot');
        
        function showSlide(idx) {
            slides[activeIdx].classList.remove('active');
            if (dots.length) dots[activeIdx].classList.remove('active');
            
            activeIdx = (idx + slides.length) % slides.length;
            
            slides[activeIdx].classList.add('active');
            if (dots.length) dots[activeIdx].classList.add('active');
        }
        
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showSlide(activeIdx - 1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showSlide(activeIdx + 1); });
        
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(parseInt(dot.dataset.idx));
            });
        });
    });
}

document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') {
        closeModal(); 
        const lb = document.getElementById('lightbox-modal');
        if (lb && lb.classList.contains('show')) {
            lb.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
});

// Apply lang, lightbox, carousels and product page init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(getLang());
    initLightbox();
    initCarousels();
    initProductPage();
    
    // Global optimized mouse glow effect for card hover (avoids layout thrashing)
    document.addEventListener('mousemove', e => {
        const card = e.target.closest('.card');
        if (card) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    });
});
