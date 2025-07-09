// Add item to cart (with quantity logic)
export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id === product.id);

  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

// Update cart item count in UI
export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Render the cart modal with remove buttons
export function renderCartModal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
 const total = cart.reduce((sum, item) => {
  const cleanPrice = Number(item.price.replace(/[^0-9.]/g, ''));
  return sum + cleanPrice * item.quantity;
}, 0);


  return `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">Your Cart</h2>
        <ul class="space-y-4">
          ${cart.map(item => `
            <li class="border-b pb-2 flex justify-between items-center">
              <div>
                <div class="font-semibold">${item.name}</div>
                <div class="text-sm text-gray-500">Price: $${item.price}</div>
                <div class="text-sm text-gray-500">Quantity: ${item.quantity}</div>
              </div>
              <button class="remove-item text-red-600" data-id="${item.id}">Remove</button>
            </li>
          `).join("")}
        </ul>

        <div class="mt-4 font-bold text-right text-lg">Total: $${total.toFixed(2)}</div>

        <div class="mt-4 flex justify-end gap-2">
          <button id="clear-cart" class="bg-red-500 text-white px-4 py-2 rounded">Clear All</button>
          <button id="close-cart" class="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  `;
}


// Setup event listeners for cart interactions
export function setupCartEvents() {
  document.getElementById("cart-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    const modalHTML = renderCartModal();
    const modalWrapper = document.createElement("div");
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper.firstElementChild);
  });

  document.addEventListener("click", (e) => {
    // Close modal
    if (e.target.id === "close-cart") {
      document.getElementById("cart-modal")?.remove();
    }

    // Remove single item
    if (e.target.classList.contains("remove-item")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      reRenderCartModal();
      showToast("Item removed");
    }

    // Clear all
    if (e.target.id === "clear-cart") {
      localStorage.removeItem("cart");
      updateCartCount();
      reRenderCartModal();
      showToast("Cart cleared");
    }
  });
}

// Re-render modal contents
function reRenderCartModal() {
  const oldModal = document.getElementById("cart-modal");
  if (oldModal) {
    oldModal.outerHTML = renderCartModal();
  }
}

// Optional: simple toast popup
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-bounce";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
