import { renderHeader } from "./components/header.js";
import { renderHome } from "./pages/home.js";
import { renderCartPage } from "./pages/cart.js";
import "./styles.css";

async function addToCart(product) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Please login to add items to cart");
    import("./pages/login.js").then(module => module.renderLoginPage());
    return;
  }

  console.log("🟢 Product received:", product);
  
  const payload = {
    productId: product._id || product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image || "",
    quantity: 1
  };

  console.log("🟡 Payload being sent:", payload);

  if (!payload.productId || !payload.name || !payload.price) {
    alert("❌ Missing required product information");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Add to cart error:", errorData);
      
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        import("./pages/login.js").then(module => module.renderLoginPage());
        return;
      }
      
      alert(`❌ Add to cart failed: ${errorData.message}`);
      return;
    }

    const result = await res.json();
    console.log("✅ Added to cart:", result);
    showToast(`${product.name} added to cart`);
    
  } catch (error) {
    console.error("❌ Network error:", error);
    alert("❌ Network error. Please try again.");
  }
}

export async function renderCartModal() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Please login to view cart");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        import("./pages/login.js").then(module => module.renderLoginPage());
        return;
      }
      throw new Error("Failed to fetch cart");
    }

    const cart = await res.json();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const modalHTML = `
      <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto shadow-lg">
          <h2 class="text-xl font-bold mb-4">🛒 Your Cart</h2>
          ${cart.length === 0 ? 
            '<p class="text-gray-500 text-center py-8">Your cart is empty</p>' :
            `<ul class="space-y-4">
              ${cart.map(item => `
                <li class="border-b pb-2">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-semibold">${item.name}</div>
                      <div class="text-sm text-gray-600">Price: $${item.price}</div>
                      <div class="text-sm text-gray-600 flex items-center gap-2">
                        <span>Qty:</span>
                        <button class="decrease-qty bg-gray-200 px-2 py-1 rounded" data-id="${item._id}">−</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty bg-gray-200 px-2 py-1 rounded" data-id="${item._id}">+</button>
                      </div>
                    </div>
                    <button class="remove-cart-item text-red-600 hover:text-red-800" data-id="${item._id}">Remove</button>
                  </div>
                </li>
              `).join("")}
            </ul>
            <div class="mt-4 text-right font-bold text-lg">Total: $${total.toFixed(2)}</div>`
          }
          <div class="flex justify-end mt-4 gap-2">
            ${cart.length > 0 ? '<button id="clear-cart" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Clear All</button>' : ''}
            <button id="close-cart" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);

    // Event listeners
    document.getElementById("close-cart").addEventListener("click", () => {
      document.getElementById("cart-modal")?.remove();
    });

    document.getElementById("clear-cart")?.addEventListener("click", async () => {
      try {
        await fetch("http://localhost:3000/api/cart", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        document.getElementById("cart-modal")?.remove();
        showToast("Cart cleared");
      } catch (error) {
        console.error("Error clearing cart:", error);
        alert("Failed to clear cart");
      }
    });

    document.querySelectorAll(".remove-cart-item").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        try {
          await fetch(`http://localhost:3000/api/cart/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          document.getElementById("cart-modal")?.remove();
          renderCartModal();
        } catch (error) {
          console.error("Error removing item:", error);
          alert("Failed to remove item");
        }
      });
    });

    document.querySelectorAll(".increase-qty").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const item = cart.find(i => i._id === id);
        try {
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
        } catch (error) {
          console.error("Error updating quantity:", error);
          alert("Failed to update quantity");
        }
      });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const item = cart.find(i => i._id === id);
        try {
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
        } catch (error) {
          console.error("Error updating quantity:", error);
          alert("Failed to update quantity");
        }
      });
    });

  } catch (error) {
    console.error("❌ Error loading cart:", error);
    alert("Failed to load cart");
  }
}

async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products");
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    console.log("✅ Products fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    showToast("Failed to load products");
    return [];
  }
}

function createCard(product) {
  console.log("🧪 createCard product:", product);
  return `
    <div class="product-card bg-white rounded-lg shadow-md p-4 w-full max-w-xs hover:shadow-lg transition-shadow" data-id="${product._id}">
      <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'" />
      <h3 class="mt-3 text-lg font-semibold text-gray-800">${product.name}</h3>
      <p class="text-sm text-gray-600 mt-1">${product.description || "No description available."}</p>
      <p class="text-xs text-gray-500 mt-1">Category: ${product.category}</p>
      <p class="text-xs text-gray-500">Stock: ${product.stock}</p>
      <strong class="block text-blue-600 font-bold mt-2">$${product.price}</strong>
      <button data-product='${JSON.stringify(product)}' class="add-to-cart bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full transition-colors">
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
    <div id="loading" class="text-center py-8">Loading products...</div>
    <section id="product-list" class="flex flex-wrap gap-6 justify-center p-8 bg-gray-100 min-h-screen"></section>
  `;

  try {
    const products = await getProducts();
    document.getElementById("loading").remove();
    
    if (products.length === 0) {
      document.getElementById("product-list").innerHTML = '<p class="text-center text-gray-500 w-full">No products available</p>';
    } else {
      document.getElementById("product-list").innerHTML = products.map(createCard).join("");
    }

    // Add event listeners for cart buttons
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        const product = JSON.parse(btn.getAttribute("data-product"));
        addToCart(product);
      });
    });

  } catch (error) {
    console.error("Error mounting app:", error);
    document.getElementById("loading").innerHTML = '<p class="text-center text-red-500">Failed to load products</p>';
  }

  // Navigation event listeners
  document.getElementById("home-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    mountApp();
  });

  document.getElementById("logo")?.addEventListener("click", () => mountApp());

  document.getElementById("cart-link")?.addEventListener("click", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view cart");
      import("./pages/login.js").then(module => module.renderLoginPage());
      return;
    }
    await renderCartModal();
  });

  document.getElementById("login-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("./pages/login.js").then(module => module.renderLoginPage());
  });

  document.getElementById("logout-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    showToast("Logged out successfully");
    mountApp();
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Initialize app
mountApp();
export { mountApp };