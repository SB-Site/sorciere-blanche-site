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
  const itemIndex = cart.findIndex(item => item.productId === productId);
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = parseInt(quantity);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  console.log('Panier mis à jour:', { productId, quantity });
  if (typeof updateCartDisplay === 'function') {
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Votre panier est vide.</p>';
    cartSubtotal.textContent = 'Sous-total : 0,00 €';
    cartTotal.textContent = 'Total estimé : 0,00 €';
  } else {
    let tableHTML = '<table><tr><th>Produit</th><th>Prix</th><th>Quantité</th><th>Action</th></tr>';
    cart.forEach(item => {
      tableHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.price.toFixed(2)} €</td>
          <td><input type="number" value="${item.quantity}" min="0" onchange="updateCart('${item.productId}', this.value)"></td>
          <td><button class="remove-button" onclick="updateCart('${item.productId}', 0)">Supprimer</button></td>
        </tr>
      `;
    });
    tableHTML += '</table>';
    cartItemsDiv.innerHTML = tableHTML;

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    cartSubtotal.textContent = `Sous-total : ${subtotal.toFixed(2)} €`;
    cartTotal.textContent = `Total estimé : ${subtotal.toFixed(2)} €`;
  }
}

function applyPromoCode() {
  const promoCode = document.getElementById('promo-code').value;
  console.log('Code promo saisi:', promoCode);
  alert('Code promo non configuré. Veuillez fournir les codes pour activation.');
  // TODO: Implémenter logique promo (ex. MEMBRE10, SAMHAIN20)
}

function deliverEbookLinks(orderDetails) {
  console.log('Livraison liens eBooks pour commande:', orderDetails);
  alert('Liens eBooks non configurés. Veuillez fournir les liens pour activation.');
  // TODO: Implémenter envoi liens via Supabase/SES après paiement
}

document.addEventListener('DOMContentLoaded', updateCartDisplay);