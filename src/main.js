import { renderHeader } from "./components/header.js";
import { renderHome } from "./pages/home.js";
import {
  addToCart,
  renderCartModal,
  setupCartEvents,
  updateCartCount
} from "./sections/cart.js";
import "./styles.css";

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
 // console.log("i am working")
  return `
    <div class="bg-white  rounded-lg  shadow-md p-4 w-full max-w-xs">
      <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded" />
      <h3 class="mt-3  text-lg font-semibold text-gray-800">${product.name}</h3>
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

  // Mount header, home section, product grid container
  app.innerHTML = `
    ${renderHeader()}
    ${renderHome()}
    <section id="product-list" class="flex flex-wrap gap-6 justify-center p-8 bg-gray-100"></section>
  `;

  // Load products and render cards
  const products = await getProducts();
  const productList = document.getElementById("product-list");
  productList.innerHTML = products.map(createCard).join("");

  // Hook up "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = JSON.parse(btn.getAttribute("data-product"));
      addToCart(product);
    });
  });

  // Inject cart modal + setup cart events
  app.insertAdjacentHTML("beforeend", renderCartModal());
  setupCartEvents();
  updateCartCount();
}

mountApp();
