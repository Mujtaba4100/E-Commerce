export function renderHeader() {
  return `
    <header class="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
      <h1 class="text-2xl font-bold cursor-pointer" id="logo">🛍️ ShopEasy</h1>
      
      <nav class="space-x-4">
        <a href="#" id="home-link" class="hover:underline">Home</a>
        <a href="#" id="cart-link" class="hover:underline">Cart</a>
      </nav>
    </header>
  `;
}
