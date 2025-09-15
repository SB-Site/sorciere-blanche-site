function addToCart(productId, name, price, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Produit ajouté au panier:', { productId, name, price, quantity });
  alert('Produit ajouté au panier !');
}
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function updateCart(productId, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  console.log('Panier mis à jour:', { productId, quantity });
  if (typeof updateCartDisplay === 'function') {
    updateCartDisplay();
  }
}
function applyPromoCode() {
  const promoCode = document.getElementById('promo-code').value;
  console.log('Code promo saisi:', promoCode);
  alert('Code promo non configuré. Veuillez fournir les codes PayPal pour activation.');
  // TODO: Implémenter logique PayPal API pour codes promo (ex. MEMBRE10, SAMHAIN20)
}
function deliverEbookLinks(orderDetails) {
  console.log('Livraison liens eBooks pour commande:', orderDetails);
  alert('Liens eBooks non configurés. Veuillez fournir les liens pour activation.');
  // TODO: Implémenter envoi liens via Supabase/SES après paiement (attente liens)
}