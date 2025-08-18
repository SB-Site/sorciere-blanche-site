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