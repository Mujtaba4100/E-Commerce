export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = cart.length;
}

export function removeItemFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // remove item by index
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

export function renderCartModal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  return `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">Your Cart</h2>
        <ul class="space-y-4">
          ${cart.length === 0
            ? `<p class="text-gray-600">Your cart is empty.</p>`
            : cart
                .map((item, index) => `
              <li class="border-b pb-2 flex justify-between items-center">
                <div>
                  <div class="font-semibold">${item.name}</div>
                  <div class="text-sm text-gray-500">${item.price}</div>
                </div>
                <button 
                  class="remove-item bg-red-500 text-white px-2 py-1 rounded text-sm"
                  data-index="${index}"
                >
                  Remove
                </button>
              </li>`)
                .join("")}
        </ul>
        <button id="close-cart" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  `;
}

export function setupCartEvents() {
  document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.id === "cart-link") {
      e.preventDefault();
      const existingModal = document.getElementById("cart-modal");
      if (existingModal) existingModal.remove();

      const app = document.getElementById("app");
      app.insertAdjacentHTML("beforeend", renderCartModal());
    }

    if (target.id === "close-cart") {
      const modal = document.getElementById("cart-modal");
      if (modal) modal.remove();
    }

    if (target.classList.contains("remove-item")) {
      const index = parseInt(target.dataset.index);
      removeItemFromCart(index);

      // Re-render modal after removal
      const modal = document.getElementById("cart-modal");
      if (modal) modal.remove();

      const app = document.getElementById("app");
      app.insertAdjacentHTML("beforeend", renderCartModal());
    }
  });
}
