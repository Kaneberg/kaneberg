/**
 * Kaneberg Core - Performance & Fluidity Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initHoverPrefetching();
    initThemeManager();
    initMobileMenu();
});

/* ==========================================================================
   1. TRANSITIONS DE PAGE ET BARRE DE PROGRESSION
   ========================================================================== */
function initPageTransitions() {
    // Injecter la barre de chargement YouTube-style si elle n'existe pas
    if (!document.getElementById('kb-top-bar')) {
        const topBar = document.createElement('div');
        topBar.id = 'kb-top-bar';
        topBar.className = 'fixed top-0 left-0 h-0.5 bg-slate-900 dark:bg-white z-50 transition-all duration-300 pointer-events-none opacity-0 w-0';
        document.body.appendChild(topBar);
    }

    // Animation d'entrée douce de la page
    document.body.classList.add('page-loaded');

    // Détecter les clics sur les liens internes pour animer la sortie
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        const target = anchor.getAttribute('target');

        // Ignorer les liens externes, ancres, ou nouveaux onglets
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http') || target === '_blank') {
            return;
        }

        e.preventDefault();
        triggerPageExit(href);
    });
}

function triggerPageExit(destinationUrl) {
    const topBar = document.getElementById('kb-top-bar');
    if (topBar) {
        topBar.classList.remove('opacity-0');
        topBar.style.width = '70%';
    }

    document.body.classList.add('page-exiting');

    // Utilisation de l'API View Transitions si disponible
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            window.location.href = destinationUrl;
        });
    } else {
        setTimeout(() => {
            if (topBar) topBar.style.width = '100%';
            window.location.href = destinationUrl;
        }, 180);
    }
}

/* ==========================================================================
   2. PRÉCHARGEMENT INSTANTANÉ AU SURVOL (Instant Prefetching)
   ========================================================================== */
function initHoverPrefetching() {
    const prefetchedUrls = new Set();

    document.addEventListener('mouseover', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || prefetchedUrls.has(href)) {
            return;
        }

        // Créer un tag <link rel="prefetch">
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = 'document';
        document.head.appendChild(link);

        prefetchedUrls.add(href);
    });
}

/* ==========================================================================
   3. GESTION DU THÈME SOMBRE / CLAIR
   ========================================================================== */
function initThemeManager() {
    const savedTheme = localStorage.getItem('kb_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('kb_theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('kb_theme', 'dark');
    }
}

/* ==========================================================================
   4. GESTION UNIFIÉE DU MENU MOBILE
   ========================================================================== */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const leftSidebar = document.getElementById('leftSidebar');
    const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

    if (!mobileMenuToggle || !leftSidebar || !mobileMenuBackdrop) return;

    function openDrawer() {
        mobileMenuBackdrop.classList.remove('hidden');
        void mobileMenuBackdrop.offsetWidth;
        mobileMenuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenuBackdrop.classList.add('opacity-100');
        leftSidebar.classList.remove('-translate-x-full');
        document.body.classList.add('overflow-hidden');
    }

    function closeDrawer() {
        leftSidebar.classList.add('-translate-x-full');
        mobileMenuBackdrop.classList.remove('opacity-100');
        mobileMenuBackdrop.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => mobileMenuBackdrop.classList.add('hidden'), 300);
        document.body.classList.remove('overflow-hidden');
    }

    mobileMenuToggle.addEventListener('click', openDrawer);
    if (closeMobileMenu) closeMobileMenu.addEventListener('click', closeDrawer);
    mobileMenuBackdrop.addEventListener('click', closeDrawer);
}
