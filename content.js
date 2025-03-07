// Indiquer que le content script est chargé
console.log("Content script Google Search chargé");

// Fonction pour scraper les résultats de recherche Google
function scrapeGoogleResults() {
  try {
    // Sélectionner tous les éléments de résultat
    const resultElements = document.querySelectorAll('div.g');
    const results = [];
    
    console.log("Éléments trouvés:", resultElements.length);
    
    // Parcourir chaque élément de résultat
    resultElements.forEach(element => {
      try {
        // Extraire le titre
        const titleElement = element.querySelector('h3');
        if (!titleElement) return;
        
        const title = titleElement.textContent.trim();
        
        // Extraire l'URL
        const linkElement = element.querySelector('a');
        if (!linkElement) return;
        
        const url = linkElement.href;
        if (!url || url.startsWith('https://webcache.googleusercontent.com') || url.startsWith('http://webcache.googleusercontent.com')) {
          return;
        }
        
        // Extraire la description
        const descElement = element.querySelector('div[data-sncf="1"]') || 
                           element.querySelector('div[data-snc="1"]') || 
                           element.querySelector('div.VwiC3b');
        
        const description = descElement ? descElement.textContent.trim() : "";
        
        // Ajouter le résultat à la liste
        results.push({
          title: title,
          url: url,
          description: description
        });
      } catch (error) {
        console.error("Erreur lors de l'extraction d'un résultat:", error);
      }
    });
    
    console.log(`${results.length} résultats extraits`);
    return results;
  } catch (error) {
    console.error("Erreur lors du scraping:", error);
    return { error: error.message };
  }
}

// Écouteur pour les messages venant du background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message reçu dans content.js:", message);
  
  if (message.action === "scrapeGoogle") {
    console.log("Début du scraping des résultats Google");
    
    // Attendre un peu pour s'assurer que la page est complètement chargée
    setTimeout(() => {
      const results = scrapeGoogleResults();
      console.log("Résultats scrapés:", results);
      sendResponse(results);
    }, 500);
    
    return true; // Indique que nous allons envoyer une réponse de manière asynchrone
  }
}); 