const WHATSAPP_NUMBER = '5535999999999'; // Insira o seu número com DDD aqui

let cart = JSON.parse(localStorage.getItem('cafe_junior_cart')) || [];

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (cartCount) {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  if (cartItemsContainer && cartTotal) {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong><br>
              ${item.quantity}x R$ ${item.price.toFixed(2)}
            </div>
            <div>
              <button style="padding: 6px 14px; font-size: 18px; font-weight: bold; min-width: 36px; min-height: 36px; cursor: pointer;" onclick="changeQuantity(${index}, -1)">-</button>
<button style="padding: 6px 14px; font-size: 18px; font-weight: bold; min-width: 36px; min-height: 36px; cursor: pointer;" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
          </div>
        `;
      });
    }
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  }
  localStorage.setItem('cafe_junior_cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  alert(`${name} adicionado ao carrinho!`);
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.toggle('active');
  }
}

function sendToWhatsApp() {
  if (cart.length === 0) {
    alert('Adicione produtos ao carrinho antes de finalizar.');
    return;
  }

  let message = 'Olá! Gostaria de fazer um pedido no Café Júnior:\n\n';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(2)}\n`;
  });

  message += `\n*Total: R$ ${total.toFixed(2)}*`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
}

document.addEventListener('DOMContentLoaded', updateCartUI);
