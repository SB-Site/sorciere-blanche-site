document.addEventListener('DOMContentLoaded', function() {
  // Filigrane invisible
  const watermark = document.createElement('div');
  watermark.style.position = 'fixed';
  watermark.style.top = '0';
  watermark.style.left = '0';
  watermark.style.width = '100%';
  watermark.style.height = '100%';
  watermark.style.zIndex = '-1';
  watermark.style.pointerEvents = 'none';
  watermark.style.background = 'transparent';
  watermark.setAttribute('aria-hidden', 'true');
  document.body.appendChild(watermark);

  // Protection clic droit (sauf pour développeurs)
  document.addEventListener('contextmenu', function(e) {
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('netlify.app')) {
      console.log('Clic droit autorisé pour développement');
      return; // Permet l'inspection sur localhost ou Netlify
    }
    e.preventDefault();
    alert('© 2025 Éditions de la Sorcière Blanche. Tous droits réservés.');
  });

  // Protection contre la sélection de texte
  document.addEventListener('selectstart', function(e) {
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('netlify.app')) {
      return; // Autorise sélection pour développement
    }
    e.preventDefault();
  });

  console.log('Protection chargée : filigrane invisible, clic droit protégé (sauf dev), Console accessible via F12');
});