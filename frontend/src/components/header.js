// src/components/header.js

export function renderHeader() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return `
    <header class="bg-blue-700 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold cursor-pointer hover:text-blue-200 transition-colors" id="logo">
          🛍️ ShopEasy
        </h1>
        
        <nav class="space-x-6">
          <a href="#" id="home-link" class="hover:text-blue-200 transition-colors">Home</a>
          <a href="#" id="cart-link" class="hover:text-blue-200 transition-colors">Cart</a>
          ${isLoggedIn
            ? `<a href="#" id="admin-link" class="hover:text-blue-200 transition-colors">Admin</a>
               <a href="#" id="logout-link" class="hover:text-blue-200 transition-colors">Logout</a>`
            : `<a href="#" id="login-link" class="hover:text-blue-200 transition-colors">Login</a>`
          }
        </nav>
      </div>
    </header>
  `;
}

export function attachHeaderEvents() {
  // Home link
  document.getElementById("home-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("../main.js").then(m => m.mountApp());
  });

  // Logo click
  document.getElementById("logo")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("../main.js").then(m => m.mountApp());
  });

  // Cart link
  document.getElementById("cart-link")?.addEventListener("click", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to view cart");
      import("../pages/login.js").then(module => module.renderLoginPage());
      return;
    }
    
    // Import and show cart modal
    import("../main.js").then(m => m.renderCartModal());
  });

  // Login link
  document.getElementById("login-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("../pages/login.js").then(module => module.renderLoginPage());
  });

  // Admin link
  document.getElementById("admin-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.open("./admin.html", "_blank");
  });

  // Logout link
  document.getElementById("logout-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    // Show success message
    showToast("Logged out successfully");
    
    // Reload app to show unauthenticated state
    setTimeout(() => {
      import("../main.js").then(m => m.mountApp());
    }, 1000);
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}