document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initHoverPrefetching();
});

function initPageTransitions() {
    if (!document.getElementById('kb-top-bar')) {
        const topBar = document.createElement('div');
        topBar.id = 'kb-top-bar';
        topBar.className = 'fixed top-0 left-0 h-0.5 bg-slate-900 dark:bg-white z-50 transition-all duration-300 pointer-events-none opacity-0 w-0';
        document.body.appendChild(topBar);
    }

    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        const target = anchor.getAttribute('target');

        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http') || target === '_blank') {
            return;
        }

        e.preventDefault();
        
        const topBar = document.getElementById('kb-top-bar');
        if (topBar) {
            topBar.classList.remove('opacity-0');
            topBar.style.width = '70%';
        }

        document.body.classList.add('page-exiting');

        setTimeout(() => {
            if (topBar) topBar.style.width = '100%';
            window.location.href = href;
        }, 150);
    });
}

function initHoverPrefetching() {
    const prefetchedUrls = new Set();

    document.addEventListener('mouseover', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || prefetchedUrls.has(href)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = 'document';
        document.head.appendChild(link);

        prefetchedUrls.add(href);
    });
}
