async function loadFeaturedArticle() {
  const featuredContainer = document.getElementById('featured-article');

  try {
    // Récupération des données JSON
    const response = await fetch('articles.json');
    if (!response.ok) throw new Error("Erreur de chargement JSON");

    const articles = await response.json();
    
    // Sélection du premier article (ou de l'article spécifique)
    const article = articles[0];

    // Remplacement du Skeleton par le contenu réel injecté avec le fondu (.fade-in)
    featuredContainer.innerHTML = `
      <div class="fade-in">
        <img class="featured-media" src="${article.image}" alt="${article.title}" />
        <div class="featured-info">
          <h2 class="featured-title">${article.title}</h2>
          <p class="featured-text">${article.description}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Impossible de charger l'article :", error);
    featuredContainer.innerHTML = `
      <div class="featured-info">
        <p class="featured-text">Erreur de chargement de l'article.</p>
      </div>
    `;
  }
}

// Exécution du script dès que le DOM est prêt
document.addEventListener('DOMContentLoaded', loadFeaturedArticle);
