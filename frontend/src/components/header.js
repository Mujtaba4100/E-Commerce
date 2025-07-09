export function renderHeader() {
  return `
    <header class="bg-white px-6 py-4 shadow-md flex justify-between items-center">
      <div class="text-2xl font-bold tracking-wide">E-Shop</div>
      <nav class="flex gap-6">
        <a href="#home" class="hover:text-blue-500">Home</a>
        <a href="#shop" class="hover:text-blue-500">Shop</a>
        <a href="#" id="cart-link" class="relative hover:text-blue-500">
          Cart
          <span id="cart-count" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full absolute -top-2 -right-3">0</span>
        </a>
      </nav>
    </header>
  `;
}
