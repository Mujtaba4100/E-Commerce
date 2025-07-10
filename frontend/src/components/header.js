export function renderHeader() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return `
    <header class="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <div class="text-2xl font-bold text-blue-600 cursor-pointer" id="logo">MyStore</div>

      <div class="flex gap-6 items-center">
        <input 
          type="text" 
          placeholder="Search products..." 
          class="border px-4 py-2 rounded w-72 text-sm focus:outline-none focus:ring focus:border-blue-300" 
        />

        <a href="#" id="cart-link" class="relative text-xl">
          🛒
          <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full" id="cart-count">0</span>
        </a>

        <div class="relative">
          <button id="profile-btn" class="flex items-center gap-1 text-gray-800 hover:text-blue-600 focus:outline-none">
            👤 Profile
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div id="profile-menu" class="absolute right-0 hidden bg-white shadow rounded w-48 mt-2 z-50">
            ${isLoggedIn ? `
              <a href="#" class="block px-4 py-2 hover:bg-gray-100">Manage Account</a>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100">My Orders</a>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100">My Reviews</a>
              <button id="logout-btn" class="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500">Logout</button>
            ` : `
              <a href="#" id="login-link" class="block px-4 py-2 hover:bg-gray-100 text-blue-600">Login</a>
            `}
          </div>
        </div>
      </div>
    </header>
  `;
}
