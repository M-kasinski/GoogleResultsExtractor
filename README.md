# Google Search Extension - Chrome

Cette extension Chrome permet d'effectuer des recherches sur Google depuis une interface dédiée et d'afficher les résultats sans avoir à naviguer directement sur la page de résultats Google.

## Fonctionnalités

- Ouvre une page de recherche lorsque l'utilisateur clique sur l'icône de l'extension
- Permet à l'utilisateur de saisir une requête dans un champ de recherche
- Effectue la recherche sur Google en arrière-plan dans un nouvel onglet
- Extrait les résultats de recherche de la page Google (titre, URL, description)
- Affiche les résultats dans l'interface de l'extension
- Ferme automatiquement l'onglet Google après avoir récupéré les résultats
- Permet d'ouvrir les liens des résultats dans de nouveaux onglets

## Installation

1. Clonez ce dépôt ou téléchargez les fichiers
2. Ouvrez Chrome et accédez à `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant les fichiers de l'extension

## Utilisation

1. Cliquez sur l'icône de l'extension dans la barre d'outils de Chrome
2. Une page de recherche s'ouvre avec l'interface Google
3. Entrez votre requête et cliquez sur "Rechercher"
4. Les résultats s'afficheront directement dans l'interface de l'extension
5. Cliquez sur un titre de résultat pour ouvrir le lien dans un nouvel onglet

## Structure des fichiers

- `manifest.json` : Configuration de l'extension (permissions, scripts, etc.)
- `background.js` : Script de fond qui gère l'ouverture de l'onglet Google et la communication entre les composants
- `content.js` : Script injecté dans l'onglet Google pour extraire les résultats de recherche
- `settings.html` : Interface utilisateur de recherche
- `settings.js` : Script associé à l'interface utilisateur pour gérer les interactions et l'affichage des résultats

## Remarques

Cette extension utilise des techniques de web scraping pour extraire les résultats de Google. Elle pourrait nécessiter des ajustements si Google modifie la structure de sa page de résultats.

## Fonctionnement technique

1. Lorsque l'utilisateur lance une recherche, l'extension ouvre un onglet Google en arrière-plan
2. Le script content.js est injecté dans cet onglet pour extraire les résultats
3. Les résultats sont envoyés à la page settings.html via le background.js
4. L'onglet Google est automatiquement fermé après l'extraction des données
5. Les résultats sont affichés dans une interface propre à l'extension 