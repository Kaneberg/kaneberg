document.addEventListener('DOMContentLoaded', () => {
  // 1. Déclenche l'effet de fondu à l'apparition
  document.body.classList.remove('page-is-entering');

  // 2. SÉCURITÉ ANTI-PAGE BLANCHE : 
  // Force la réapparition au bout de 500ms si quoi que ce soit a bloqué
  setTimeout(() => {
    document.body.classList.remove('page-is-exITING', 'page-is-entering');
    document.body.style.opacity = '1';
  }, 500);

  // 3. Gestion du clic sur les liens internes pour le fondu de sortie
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');

      // On ignore les liens externes, ancres, mailto, tel, ou ceux s'ouvrant dans un nouvel onglet
      if (
        !url ||
        url.startsWith('#') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        link.target === '_blank' ||
        e.ctrlKey || e.metaKey || e.shiftKey
      ) {
        return;
      }

      // Vérifie si le lien pointe vers une page du même domaine
      if (link.hostname === window.location.hostname) {
        e.preventDefault();
        document.body.classList.add('page-is-exITING');

        // Redirection après la durée de la transition CSS (300ms)
        setTimeout(() => {
          window.location.href = url;
        }, 300);
      }
    });
  });
});

/* 4. GESTION DU BOUTON RETOUR DU NAVIGATEUR (bfcache)
   Évite que la page reste invisible quand l'utilisateur fait "Page précédente" */
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    document.body.classList.remove('page-is-exITING', 'page-is-entering');
    document.body.style.opacity = '1';
  }
});
