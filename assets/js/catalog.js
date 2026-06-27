// ==============================================
// Relief3D — Catalog Data (Single Source of Truth)
// ==============================================
// To add a new panel, just add an entry here.
// Category slugs: 'heraldry', 'animals', 'japan', 'gaming'

const CATALOG = [
    {
        id: 'kharkiv-coat-of-arms',
        category: 'heraldry',
        img: '/assets/images/kharkiv_shield_concept.png',
        size: '350x400 mm',
        finish: 'Custom',
        title: { ua: 'Герб Харкова', en: 'Kharkiv Coat of Arms' },
        desc: {
            ua: 'Деталізоване настінне панно із зображенням класичного герба Харкова — ріг достатку та кадуцей. Стилізація під рустикове дерево та метал.',
            en: 'Detailed wall panel featuring the classic Kharkiv coat of arms — cornucopia and caduceus. Styled with rustic wood and metal textures.'
        }
    }
    // --- Add more panels here ---
    // {
    //     id: 'lucky-cat',
    //     category: 'animals',
    //     img: '/assets/images/lucky_cat.png',
    //     size: '300x400 mm',
    //     finish: 'Custom',
    //     title: { ua: 'Манекі-неко', en: 'Maneki-neko Lucky Cat' },
    //     desc: { ua: '...', en: '...' }
    // }
];

// Category metadata
const CATEGORIES = {
    heraldry: {
        slug: 'heraldry',
        icon: '🏛️',
        title: { ua: 'Геральдика', en: 'Heraldry' },
        desc: {
            ua: 'Герби міст, родів та військова символіка.',
            en: 'City coats of arms, family crests, and military insignia.'
        }
    },
    animals: {
        slug: 'animals',
        icon: '🐱',
        title: { ua: 'Тварини', en: 'Animals & Pets' },
        desc: {
            ua: 'Котики, собаки та будь-які тварини у об\'ємі.',
            en: 'Cats, dogs, and any animal brought to life in 3D relief.'
        }
    },
    japan: {
        slug: 'japan',
        icon: '⛩️',
        title: { ua: 'Японські мотиви', en: 'Japanese Art' },
        desc: {
            ua: 'Самураї, дракони, сакура та японська естетика.',
            en: 'Samurai, dragons, cherry blossoms, and Japanese aesthetics.'
        }
    },
    gaming: {
        slug: 'gaming',
        icon: '🎮',
        title: { ua: 'Геймінг & Кіно', en: 'Gaming & Cinema' },
        desc: {
            ua: 'Персонажі відеоігор, фільмів та коміксів.',
            en: 'Characters from video games, films, and comics.'
        }
    }
};

// Resolve root path for assets/links depending on page depth
function getRootPath() {
    const depth = window.location.pathname.replace(/^\//, '').split('/').filter(Boolean).length;
    return depth === 0 ? '.' : '../'.repeat(depth);
}

// Build a single catalog card element
function buildCard(item, lang) {
    const root = getRootPath();
    const card = document.createElement('article');
    card.className = 'card';
    card.onclick = () => openModal(item, lang);
    card.innerHTML = `
        <div class="card-img-wrapper">
            <img src="${root}${item.img}" alt="${item.title[lang]}" class="card-img" loading="lazy">
        </div>
        <div class="card-content">
            <h2 class="card-title">${item.title[lang]}</h2>
            <p class="card-desc">${item.desc[lang]}</p>
            <div class="specs">
                <span>${item.size}</span>
                <span>${item.finish}</span>
            </div>
            <button class="view-btn">${lang === 'ua' ? 'Детальніше' : 'View Details'}</button>
        </div>
    `;
    return card;
}

// Render cards into a container, optionally filtered by category
function renderCatalog(containerId, categoryFilter, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const items = categoryFilter ? CATALOG.filter(i => i.category === categoryFilter) : CATALOG;
    if (items.length === 0) {
        container.innerHTML = `<p class="empty-msg">${lang === 'ua' ? 'Скоро буде...' : 'Coming soon...'}</p>`;
        return;
    }
    items.forEach(item => container.appendChild(buildCard(item, lang)));
}
