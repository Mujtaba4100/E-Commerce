import { renderHeader } from "./components/header.js";
import { renderHome } from "./pages/home.js";
import "./styles.css";

// Add to cart (via backend API)
async function addToCart(product) {
  try {
    const res = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    if (!res.ok) throw new Error("Failed to add to cart");
    showToast(`${product.name} added to cart`);
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
  }
}

// Get products from backend
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

// Create product card
function createCard(product) {
  return `
    <div class="bg-white rounded-lg shadow-md p-4 w-full max-w-xs">
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

// Mount app
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

  const products = await getProducts();
  const productList = document.getElementById("product-list");
  productList.innerHTML = products.map(createCard).join("");

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = JSON.parse(btn.getAttribute("data-product"));
      addToCart(product);
    });
  });
}

// Simple toast message
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

mountApp();
