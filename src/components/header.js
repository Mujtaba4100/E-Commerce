export function renderHeader() {
  return `
    <header class="bg-white px-6 py-4 shadow-md flex justify-between items-center">
      <div class="text-2xl font-bold tracking-wide">E-Shop</div>
      <nav class="flex gap-6">
        <a href="#home" class="hover:text-blue-500">Home</a>
        <a href="#shop" class="hover:text-blue-500">Shop</a>
        <a href="#cart" id="cart-link" class="hover:text-blue-500">Cart</a>

        
      </nav>
    </header>
  `;
}
