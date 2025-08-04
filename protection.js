// SB/protection.js
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

  // Protection clic droit (sauf Console)
  document.addEventListener('contextmenu', function(e) {
    // Autoriser F12, Ctrl+Shift+I, Cmd+Opt+I
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'I')) {
      return; // Permet l'ouverture de la Console
    }
    e.preventDefault();
    alert('© 2025 Éditions de la Sorcière Blanche. Tous droits réservés.');
  });

  // Protection contre la sélection de texte
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  console.log('Protection chargée : filigrane invisible, clic droit protégé, Console accessible via F12, Ctrl+Shift+I, Cmd+Opt+I');
});