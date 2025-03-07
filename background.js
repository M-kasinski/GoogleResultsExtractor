// Écouteur pour le clic sur l'icône de l'extension
chrome.action.onClicked.addListener(() => {
  // Ouvrir la page de paramètres dans un nouvel onglet
  chrome.tabs.create({ url: chrome.runtime.getURL("settings.html") });
});

// Écouteur pour l'installation de l'extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installée");
});

// Écouteur pour les messages venant de settings.js ou content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Gérer l'ouverture d'un onglet Google pour la recherche
  if (message.action === "searchGoogle") {
    const query = message.query;
    if (!query) return;
    
    // Ouvrir un onglet Google avec la requête
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    chrome.tabs.create({ url: googleUrl, active: false }, (tab) => {
      // Attendre que la page soit complètement chargée
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Injecter le script de scraping
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }).then(() => {
            console.log("Content script injecté avec succès");
            // Envoyer un message au content script pour commencer le scraping
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { action: "scrapeGoogle", query: query }, (results) => {
                if (chrome.runtime.lastError) {
                  console.error("Erreur lors de la communication avec le content script:", chrome.runtime.lastError);
                  chrome.runtime.sendMessage({ 
                    error: "Impossible de récupérer les résultats. Veuillez réessayer." 
                  });
                  return;
                }
                
                // Fermer l'onglet Google après avoir récupéré les résultats
                chrome.tabs.remove(tab.id);
                
                // Envoyer les résultats à la page settings
                chrome.runtime.sendMessage({ results: results });
              });
            }, 500);
          }).catch(error => {
            console.error("Erreur lors de l'injection du script:", error);
            chrome.runtime.sendMessage({ 
              error: "Impossible d'injecter le script de scraping. Veuillez réessayer." 
            });
          });
        }
      });
    });
    
    return true; // Indique que nous allons envoyer une réponse de manière asynchrone
  }
}); 