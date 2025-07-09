import { renderHeader } from "./components/header.js";
import { renderHome } from "./pages/home.js";
import { renderCartPage } from "./pages/cart.js";

import "./styles.css";

async function addToCart(product) {
  const clonedProduct = { ...product };

  const payload = {
    productId: clonedProduct.id || clonedProduct._id,
    name: clonedProduct.name,
    price: Number(clonedProduct.price),
    image: clonedProduct.image,
  };

  await fetch("http://localhost:3000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  showToast(`${clonedProduct.name} added to cart`);

}

export async function renderCartModal() {
  const res = await fetch("http://localhost:3000/api/cart");
  const cart = await res.json();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const modalHTML = `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 class="text-xl font-bold mb-4">🛒 Your Cart</h2>
        <ul class="space-y-4">
          ${cart.map(item => `
            <li class="border-b pb-2">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-semibold">${item.name}</div>
                  <div class="text-sm text-gray-600">Price: $${item.price}</div>
                  <div class="text-sm text-gray-600 flex items-center gap-2">
                    <span>Qty:</span>
                    <button class="decrease-qty bg-gray-200 px-2" data-id="${item._id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty bg-gray-200 px-2" data-id="${item._id}">+</button>
                  </div>
                </div>
                <button class="remove-cart-item text-red-600" data-id="${item._id}">Remove</button>
              </div>
            </li>
          `).join("")}
        </ul>

        <div class="mt-4 text-right font-bold text-lg">Total: $${total.toFixed(2)}</div>
        <div class="flex justify-end mt-4 gap-2">
          <button id="clear-cart" class="bg-red-500 text-white px-4 py-2 rounded">Clear All</button>
          <button id="close-cart" class="bg-blue-600 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = modalHTML;
  document.body.appendChild(wrapper.firstElementChild);

  document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-modal")?.remove();
  });

  document.getElementById("clear-cart").addEventListener("click", async () => {
    await fetch("http://localhost:3000/api/cart", { method: "DELETE" });
    document.getElementById("cart-modal")?.remove();
    showToast("Cart cleared");
  });

  document.querySelectorAll(".remove-cart-item").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await fetch(`http://localhost:3000/api/cart/${id}`, { method: "DELETE" });
      document.getElementById("cart-modal")?.remove();
      renderCartModal();
    });
  });

 document.querySelectorAll(".increase-qty").forEach(btn => {
  btn.addEventListener("click", async () => {
    const id = btn.getAttribute("data-id");
    const res = await fetch("http://localhost:3000/api/cart");
    const updatedCart = await res.json();
    const item = updatedCart.find(i => i._id === id);

    await fetch(`http://localhost:3000/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: item.quantity + 1 })
    });

    renderCartPage();
  });
});


document.querySelectorAll(".decrease-qty").forEach(btn => {
  btn.addEventListener("click", async () => {
    const id = btn.getAttribute("data-id");
    const res = await fetch("http://localhost:3000/api/cart");
    const updatedCart = await res.json();
    const item = updatedCart.find(i => i._id === id);

    if (item.quantity === 1) {
      await fetch(`http://localhost:3000/api/cart/${id}`, { method: "DELETE" });
    } else {
      await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity - 1 })
      });
    }
  
    renderCartPage();
  });
});
}

async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    console.log("✅ Products fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

function createCard(product) {
  return `
    <div class="product-card bg-white rounded-lg shadow-md p-4 w-full max-w-xs" data-id="${product._id || product.id}"">
      <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded" />
      <h3 class="mt-3 text-lg font-semibold text-gray-800">${product.name}</h3>
      <p class="text-sm text-gray-600 mt-1">${product.description}</p>
      <strong class="block text-blue-600 font-bold mt-2">${product.price}</strong>
      <button data-product='${JSON.stringify(product)}' class="add-to-cart bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3">
        Add to Cart
      </button>
    </div>
  `;
}

async function mountApp() {
  const app = document.getElementById("app");
  if (!app) {
    console.error("❌ #app div not found!");
    return;
  }

  app.innerHTML = `
    ${renderHeader()}
    ${renderHome()}
    <section id="product-list" class="flex flex-wrap gap-6 justify-center p-8 bg-gray-100"></section>
  `;
  const homeLink = document.getElementById("home-link");
if (homeLink) {
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    mountApp(); // reload home
  });
}

const logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("click", () => {
    mountApp(); // clicking logo returns to home
  });
}


  const products = await getProducts();
  const productList = document.getElementById("product-list");
  productList.innerHTML = products.map(createCard).join("");

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = JSON.parse(btn.getAttribute("data-product"));
      addToCart(product);
    });
    const cartLink = document.getElementById("cart-link");
if (cartLink) {
  cartLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await renderCartPage(); // 👈 now using full page
  });
}
  });}

 


function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

mountApp();
export { mountApp }; // 👈 Must export for cart page to use

