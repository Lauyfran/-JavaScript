let products = [];
let cartItems = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  const storedCartItems = localStorage.getItem('cartItems');
  if (storedCartItems) {
    cartItems = JSON.parse(storedCartItems);
  }
  renderCart();
});

function fetchProducts() {
  fetch('data/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      products = data;
      renderProductGrid();
    })
    .catch(error => console.error('Error loading products:', error));
}

function renderProductGrid() {
  const productGrid = document.getElementById('product-grid');
  productGrid.innerHTML = ''; // Limpiar el grid antes de renderizar

  products.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'col-md-3 mb-4';

    productCard.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
          <button class="btn btn-primary add-to-cart-btn" data-index="${index}">Agregar al Carrito</button>
        </div>
      </div>
    `;

    productGrid.appendChild(productCard);
  });
}

function addToCart(index) {
  const product = products[index];
  const existingItem = cartItems.find(item => item.name === product.name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  saveCartToLocalStorage();
  renderCart();
}

function removeFromCart(index) {
  const item = cartItems[index];
  
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cartItems.splice(index, 1);
  }
  
  saveCartToLocalStorage();
  renderCart();
}

function renderCart() {
  const cartTableBody = document.getElementById('cart-table-body');
  const totalPriceElement = document.getElementById('total-price');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartTableBody.innerHTML = '';
  let totalPrice = 0;

  cartItems.forEach((item, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${item.name}</td>
    <td>$${item.price.toFixed(2)}</td>
    <td>
      <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-index="${index}">
    </td>
    <td>$${(item.price * item.quantity).toFixed(2)}</td>
    <td><button class="btn btn-danger btn-sm remove-from-cart-btn" data-index="${index}">Eliminar</button></td>
  `;

    cartTableBody.appendChild(row);
    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  checkoutBtn.disabled = cartItems.length === 0;
}

function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
// Event listener para agregar al carrito
document.getElementById('product-grid').addEventListener('click', event => {
  if (event.target.classList.contains('add-to-cart-btn')) {
    const index = parseInt(event.target.getAttribute('data-index'));
    addToCart(index);
  }
});

// Event listener para eliminar del carrito
document.getElementById('cart-table-body').addEventListener('click', event => {
  if (event.target.classList.contains('remove-from-cart-btn')) {
    const index = parseInt(event.target.getAttribute('data-index'));
    removeFromCart(index);
  }
});

// Event listener para proceder al pago
document.getElementById('checkout-btn').addEventListener('click', () => {
  swal("Proximamente");
});
