// ==============================================
// Relief3D — Catalog Data (Single Source of Truth)
// ==============================================
// Automatically generated from Exobrain panels_db.json. Do not edit directly.

const CATALOG = [
    {
        "id": "kharkiv-coat-of-arms",
        "category": "heraldry",
        "img": "/assets/images/kharkiv_3d_close.png",
        "size": "350 x 400 мм (базовий)",
        "finish": "PLA / PETG (Деревна текстура + металік)",
        "title": {
            "ua": "Герб Харкова (Ріг Достатку)",
            "en": "Kharkiv Coat of Arms Shield"
        },
        "desc": {
            "ua": "Ексклюзивне об'ємне настінне панно із зображенням офіційного герба міста Харків. Робота поєднує класичну військову геральдику та сучасні тенденції 3D-декору. Текстурована темно-дерев'яна основа створює глибокий контраст із золотим рогом достатку та срібним кадуцеєм.",
            "en": "An exclusive 3D wall panel featuring the official coat of arms of Kharkiv. This piece combines classic military heraldry with modern 3D home decor trends. The dark rustic wood-textured shield base creates a deep contrast with the golden cornucopia and the silver caduceus."
        },
        "materials": [
            "matte-black",
            "silk-gold",
            "copper"
        ]
    },
    {
        "id": "cats-family",
        "category": "animals",
        "img": "/assets/images/cats_family_3d_close.png",
        "size": "300 x 300 мм",
        "finish": "PLA (Матовий або шовковий біо-пластик)",
        "title": {
            "ua": "Сім'я Котів",
            "en": "Cat Family"
        },
        "desc": {
            "ua": "Затишне настінне панно із зображенням трьох котів, що сплелися хвостами. Уособлює домашнє вогнище, любов та сімейний затишок. Створено з екологічного біо-пластику.",
            "en": "Cozy wall panel depicting an intertwined cat family. A perfect symbol of home warmth, love, and care. Made from eco-friendly bio-plastic."
        },
        "materials": [
            "matte-black",
            "silk-gold",
            "wood",
            "copper"
        ]
    },
    {
        "id": "bond-wednesday",
        "category": "gaming",
        "img": "/assets/images/bond_wednesday_vector_close.png",
        "size": "400 x 200 мм",
        "finish": "PLA (Матовий чорний лайн-арт)",
        "title": {
            "ua": "Бонд та Венздей",
            "en": "Bond & Wednesday"
        },
        "desc": {
            "ua": "Кінематографічний 3D-кросовер силуетів Агента 007 та Венздей біля Aston Martin. Оптимізований для легкого CAD моделювання, обведення векторів та швидкого друку.",
            "en": "Cinematic 3D crossover silhouettes of Agent 007 and Wednesday next to the Aston Martin. Specially optimized for easy CAD tracing and fast printing."
        },
        "materials": [
            "matte-black",
            "silk-gold"
        ]
    }
];

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
            ua: 'Котики, собаки та будь-які тварини у об'ємі.',
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

const MATERIALS = {
    'matte-black': {
        name: { ua: 'Матовий Чорний', en: 'Matte Black' },
        img: '/assets/images/filament_matte_black.png',
        color: '#121212'
    },
    'silk-gold': {
        name: { ua: 'Шовкове Золото', en: 'Silk Gold' },
        img: '/assets/images/filament_silk_gold.png',
        color: 'linear-gradient(135deg, #e6c27a, #996515)'
    },
    'wood': {
        name: { ua: 'Текстура Дерева', en: 'Wood Fill' },
        img: '/assets/images/filament_wood.png',
        color: '#be9b7b'
    },
    'copper': {
        name: { ua: 'Металева Мідь', en: 'Metallic Copper' },
        img: '/assets/images/filament_copper.png',
        color: '#b87333'
    }
};

function getRootPath() {
    const path = window.location.pathname;
    if (path.includes('/product/') || path.includes('/category/')) {
        return '../..';
    }
    if (path.includes('/catalog/')) {
        return '..';
    }
    return '.';
}

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
