// Add item to cart (with quantity logic)
export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id == product.id);

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

// Render cart modal
export function renderCartModal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  return `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">Your Cart</h2>
        <ul class="space-y-4">
          ${cart.map((item, index) => `
            <li class="border-b pb-2">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-semibold">${item.name}</div>
                  <div class="text-sm text-gray-500">Price: ${item.price}</div>
                  <div class="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    Quantity:
                    <button class="dec-qty px-2 bg-gray-300 rounded" data-id="${item.id}">-</button>
                    <span class="px-2">${item.quantity}</span>
                    <button class="inc-qty px-2 bg-gray-300 rounded" data-id="${item.id}">+</button>
                  </div>
                </div>
                <button class="remove-item text-red-600" data-index="${index}">Remove</button>
              </div>
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

// Set up cart modal + quantity buttons
export function setupCartEvents() {
  document.getElementById("cart-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.getElementById("cart-modal")) return; // Prevent duplicates

    const modalHTML = renderCartModal();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);
    bindQuantityButtons();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;

    // Close cart
    if (target.id === "close-cart") {
      document.getElementById("cart-modal")?.remove();
    }

    // Remove item
    if (target.classList.contains("remove-item")) {
      const index = parseInt(target.getAttribute("data-index"));
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      reRenderCartModal();
      showToast("Item removed");
    }

    // Clear all
    if (target.id === "clear-cart") {
      localStorage.removeItem("cart");
      updateCartCount();
      reRenderCartModal();
      showToast("Cart cleared");
    }
  });
}

// Bind + and − quantity buttons
function bindQuantityButtons() {
  document.querySelectorAll(".inc-qty").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex(item => item.id == id);
      if (index !== -1) {
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        reRenderCartModal();
      }
    });
  });

  document.querySelectorAll(".dec-qty").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex(item => item.id == id);
      if (index !== -1) {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        reRenderCartModal();
      }
    });
  });
}

// Re-render the modal + rebind buttons
function reRenderCartModal() {
  const oldModal = document.getElementById("cart-modal");
  if (oldModal) {
    oldModal.outerHTML = renderCartModal();
    bindQuantityButtons();
  }
}

// Toast popup
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
