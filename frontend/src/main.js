import { renderHeader } from "./components/header.js";
import { renderHome } from "./pages/home.js";
import { renderCartPage } from "./pages/cart.js";
import "./styles.css";

async function addToCart(product) {
  console.log("🟢 Product received:", product); // ✅ Debug
  const payload = {
  productId: product._id || product.id,
  name: product.name || product.title,   // fallback to title
  price: Number(product.price || product.cost), // fallback to cost
  image: product.image || "",
};

  console.log("🟡 Payload being sent:", payload); // ✅ Debug

  if (!payload.name || !payload.price) {
    alert("❌ Missing product name or price. Please check console.");
    return;
  }

  const res = await fetch("http://localhost:3000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Add to cart error:", errorText);
    alert("❌ Add to cart failed.");
    return;
  }

  showToast(`${product.name} added to cart`);
}



export async function renderCartModal() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });

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
                  <div class="font-semibold">${item.name || "Unnamed"}</div>
                  <div class="text-sm text-gray-600">Price: $${item.price || 0}</div>
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
    await fetch("http://localhost:3000/api/cart", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    document.getElementById("cart-modal")?.remove();
    showToast("Cart cleared");
  });

  document.querySelectorAll(".remove-cart-item").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      document.getElementById("cart-modal")?.remove();
      renderCartModal();
    });
  });

  document.querySelectorAll(".increase-qty").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const item = cart.find(i => i._id === id);
      await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      document.getElementById("cart-modal")?.remove();
      renderCartModal();
    });
  });

  document.querySelectorAll(".decrease-qty").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const item = cart.find(i => i._id === id);
      if (item.quantity === 1) {
        await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        });
      }
      document.getElementById("cart-modal")?.remove();
      renderCartModal();
    });
  });
}

async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

function createCard(product) {
  console.log("🧪 createCard product:", product); // ✅ Debug
  return `
    <div class="product-card bg-white rounded-lg shadow-md p-4 w-full max-w-xs" data-id="${product._id || product.id}">
      <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded" />
      <h3 class="mt-3 text-lg font-semibold text-gray-800">${product.name}</h3>
      <p class="text-sm text-gray-600 mt-1">${product.description || "No description."}</p>
      <strong class="block text-blue-600 font-bold mt-2">$${product.price}</strong>
      <button data-product='${JSON.stringify(product)}' class="add-to-cart bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3">
        Add to Cart
      </button>
    </div>
  `;
}

async function mountApp() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    ${renderHeader()}
    ${renderHome()}
    <section id="product-list" class="flex flex-wrap gap-6 justify-center p-8 bg-gray-100"></section>
  `;

  const products = await getProducts();
  document.getElementById("product-list").innerHTML = products.map(createCard).join("");

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = JSON.parse(btn.getAttribute("data-product"));
      addToCart(product);
    });
  });

  document.getElementById("home-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    mountApp();
  });

  document.getElementById("logo")?.addEventListener("click", () => mountApp());

  document.getElementById("cart-link")?.addEventListener("click", async (e) => {
    e.preventDefault();
    await renderCartPage();
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("userId");
    location.reload();
  });

  document.getElementById("login-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("./pages/login.js").then(module => module.renderLoginPage());
  });

  document.getElementById("logout-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("Logged out");
    mountApp();
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

mountApp();
export { mountApp };
