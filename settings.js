// Éléments DOM
const queryInput = document.getElementById('query');
const searchButton = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const statusDiv = document.getElementById('status');

// Fonction pour envoyer une requête à Google
function searchGoogle(query) {
  statusDiv.textContent = "Préparation de la recherche...";
  
  try {
    // Envoyer la requête au background script
    statusDiv.textContent = "Recherche en cours sur Google...";
    
    chrome.runtime.sendMessage({ 
      action: "searchGoogle",
      query: query 
    });
  } catch (error) {
    statusDiv.textContent = `Erreur: ${error.message}`;
    console.error(error);
  }
}

// Fonction pour afficher les résultats
function displayResults(data) {
  resultsDiv.innerHTML = "";
  
  if (data.error) {
    resultsDiv.innerHTML = `<div class="error">Erreur: ${data.error}</div>`;
    return;
  }
  
  try {
    // Vérifier si les données contiennent des résultats
    if (data && Array.isArray(data)) {
      const results = data;
      
      console.log("Résultats reçus:", results);
      
      if (results.length === 0) {
        resultsDiv.innerHTML = "<div>Aucun résultat trouvé.</div>";
        return;
      }
      
      // Créer un élément pour chaque résultat
      results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const title = document.createElement('div');
        title.className = 'result-title';
        
        const link = document.createElement('a');
        link.href = result.url;
        link.textContent = result.title;
        link.target = "_blank";
        title.appendChild(link);
        
        const url = document.createElement('div');
        url.className = 'result-url';
        url.textContent = result.url;
        
        const desc = document.createElement('div');
        desc.className = 'result-desc';
        desc.textContent = result.description;
        
        resultItem.appendChild(title);
        resultItem.appendChild(url);
        resultItem.appendChild(desc);
        
        resultsDiv.appendChild(resultItem);
      });
    } else {
      // Afficher les données brutes si la structure n'est pas celle attendue
      resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  } catch (error) {
    resultsDiv.innerHTML = `<div class="error">Erreur lors de l'affichage des résultats: ${error.message}</div>`;
    console.error(error);
  }
}

// Événement sur le bouton de recherche
searchButton.addEventListener('click', () => {
  const query = queryInput.value.trim();
  
  if (query) {
    resultsDiv.innerHTML = "";
    searchGoogle(query);
  } else {
    statusDiv.textContent = "Veuillez entrer une requête de recherche.";
  }
});

// Événement sur la touche Entrée dans le champ de saisie
queryInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchButton.click();
  }
});

// Écoute des messages venant du background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.status) {
    statusDiv.textContent = message.status;
  }
  
  if (message.results) {
    statusDiv.textContent = "Résultats reçus";
    displayResults(message.results);
  }
  
  if (message.error) {
    statusDiv.textContent = "Erreur";
    resultsDiv.innerHTML = `<div class="error">Erreur: ${message.error}</div>`;
  }
});

// Mettre le focus sur le champ de recherche au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  queryInput.focus();
}); 