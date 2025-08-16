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
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('sorciereblancheeditions.com') || 
        window.location.hostname.includes('sorciereblancheeditions.vercel.app')) {
      console.log('Clic droit autorisé pour développement');
      return;
    }
    e.preventDefault();
    alert('© 2025 Éditions de la Sorcière Blanche. Tous droits réservés.');
  });

  // Protection contre la sélection de texte
  document.addEventListener('selectstart', function(e) {
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('sorciereblancheeditions.com') || 
        window.location.hostname.includes('sorciereblancheeditions.vercel.app')) {
      return;
    }
    e.preventDefault();
  });

  console.log('Protection chargée : filigrane invisible, clic droit protégé (sauf dev), Console accessible via F12');
});