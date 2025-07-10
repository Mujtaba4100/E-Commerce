// src/pages/home.js

export function renderHome() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return `
    <section class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6">
      <div class="container mx-auto text-center">
        <h1 class="text-5xl font-bold mb-6">Welcome to ShopEasy</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Discover amazing products at unbeatable prices. Your one-stop shop for everything you need!
        </p>
        
        ${!isLoggedIn ? `
          <div class="space-x-4">
            <button id="cta-login" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Login to Shop
            </button>
            <button id="cta-register" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Create Account
            </button>
          </div>
        ` : `
          <div class="text-lg">
            <p class="mb-4">🎉 Welcome back! Start shopping below.</p>
            <div class="space-x-4">
              <button id="scroll-to-products" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Products
              </button>
              <button id="view-cart" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                View Cart
              </button>
            </div>
          </div>
        `}
      </div>
    </section>
  `;
}

export function attachHomeEvents() {
  // Login CTA
  document.getElementById("cta-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("./login.js").then(m => m.renderLoginPage());
  });

  // Register CTA
  document.getElementById("cta-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("./register.js").then(m => m.renderRegisterPage());
  });

  // Scroll to products
  document.getElementById("scroll-to-products")?.addEventListener("click", (e) => {
    e.preventDefault();
    const productSection = document.getElementById("product-list");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // View cart
  document.getElementById("view-cart")?.addEventListener("click", (e) => {
    e.preventDefault();
    import("../main.js").then(m => m.renderCartModal());
  });
} 