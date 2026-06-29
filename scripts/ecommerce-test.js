import {cart, addToCart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {getCurrentUser, logout} from '../data/auth.js';
import {filterProducts} from './utils/filterProducts.js';
import {getPageProducts, getTotalPages, PRODUCTS_PER_PAGE} from './utils/pagination.js';

if (!getCurrentUser()) {
  window.location.href = 'login.html';
}

let currentPage = 1;
let currentFiltered = products;

function buildProductHTML(product) {
  const cartItem = cart.find(item => item.productId === product.id);

  return `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="cart-item-controls">
        ${cartItem ? `
          <span class="cart-item-qty">
            <img src="images/icons/checkmark.png"> In cart: ${cartItem.quantity}
          </span>
          <button class="remove-from-cart-btn js-remove-from-cart"
            data-product-id="${product.id}">Remove</button>
        ` : ''}
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
}

function renderProducts(pageProducts) {
  const grid = document.querySelector('.js-products-grid');
  grid.innerHTML = pageProducts.map(buildProductHTML).join('');

  grid.querySelectorAll('.js-add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.productId);
      updateCartQuantity();
      refreshView();
    });
  });

  grid.querySelectorAll('.js-remove-from-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.productId);
      updateCartQuantity();
      refreshView();
    });
  });
}

function renderPagination() {
  const totalPages = getTotalPages(currentFiltered.length);
  const container = document.querySelector('.js-pagination');

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button class="page-btn js-page-prev" ${currentPage === 1 ? 'disabled' : ''}>&larr;</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn js-page-num ${i === currentPage ? 'page-btn-active' : ''}"
      data-page="${i}">${i}</button>`;
  }

  html += `
    <button class="page-btn js-page-next" ${currentPage === totalPages ? 'disabled' : ''}>&rarr;</button>
  `;

  container.innerHTML = html;

  container.querySelector('.js-page-prev').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; refreshView(); scrollToProducts(); }
  });
  container.querySelector('.js-page-next').addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; refreshView(); scrollToProducts(); }
  });
  container.querySelectorAll('.js-page-num').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = Number(btn.dataset.page);
      refreshView();
      scrollToProducts();
    });
  });
}

function scrollToProducts() {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function refreshView() {
  const pageItems = getPageProducts(currentFiltered, currentPage);
  renderProducts(pageItems);
  renderPagination();

  const noResults = document.querySelector('.js-no-results');
  const hasResults = currentFiltered.length > 0;
  noResults.style.display = hasResults ? 'none' : 'block';
  noResults.textContent = hasResults ? '' : 'No products found for your search.';
}

function updateCartQuantity() {
  let total = 0;
  cart.forEach(item => { total += item.quantity; });
  document.querySelector('.js-cart-quantity').innerHTML = total;
}

function updateAccountHeader() {
  const user = getCurrentUser();
  const accountLink = document.querySelector('.js-account-link');
  const greeting = document.querySelector('.js-account-greeting');
  const accountText = document.querySelector('.js-account-text');

  if (user) {
    greeting.textContent = `Hello, ${user.name.split(' ')[0]}`;
    accountText.textContent = 'Sign Out';
    accountLink.href = '#';
    accountLink.addEventListener('click', event => {
      event.preventDefault();
      logout();
    });
  }
}

refreshView();
updateCartQuantity();
updateAccountHeader();

const searchBar = document.querySelector('.search-bar');

searchBar.addEventListener('input', () => {
  currentFiltered = filterProducts(products, searchBar.value);
  currentPage = 1;
  refreshView();
});

document.querySelector('.search-button').addEventListener('click', () => {
  currentFiltered = filterProducts(products, searchBar.value);
  currentPage = 1;
  refreshView();
});
