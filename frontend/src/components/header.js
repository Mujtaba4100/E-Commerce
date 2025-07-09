export function renderHeader() {
  const isLoggedIn = localStorage.getItem("token");

  return `
    <header class="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
      <h1 class="text-2xl font-bold cursor-pointer" id="logo">🛍️ ShopEasy</h1>
      
      <nav class="space-x-4">
        <a href="#" id="home-link">Home</a>
        <a href="#" id="cart-link">Cart</a>
        ${isLoggedIn
          ? `<a href="#" id="logout-link">Logout</a>`
          : `<a href="#" id="login-link">Login</a>`}
      </nav>
    </header>
  `;
}
