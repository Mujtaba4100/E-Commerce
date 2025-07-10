// src/pages/register.js

export function renderRegisterPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="p-6 max-w-md mx-auto mt-12 bg-white shadow rounded">
      <h1 class="text-2xl font-bold mb-4 text-center">📝 Create Account</h1>
      <form id="register-form" class="space-y-4">
        <input 
          type="text" 
          id="name" 
          placeholder="Full Name" 
          required 
          class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
        />
        <input 
          type="email" 
          id="email" 
          placeholder="Email" 
          required 
          class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
        />
        <input 
          type="password" 
          id="password" 
          placeholder="Password (min 6 characters)" 
          required 
          minlength="6"
          class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
        />
        <button 
          type="submit" 
          class="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition-colors"
        >
          Register
        </button>
      </form>
      <p class="text-sm text-center mt-4">
        Already have an account? 
        <a href="#" id="go-login" class="text-blue-600 hover:underline">Login</a>
      </p>
      <p class="text-sm text-center mt-2">
        <a href="#" id="home-link" class="text-gray-600 hover:underline">← Back to Home</a>
      </p>
    </div>
  `;

  // Go to login page
  document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    import("./login.js").then(m => m.renderLoginPage());
  });

  // Go back to home
  document.getElementById("home-link").addEventListener("click", (e) => {
    e.preventDefault();
    import("../main.js").then(m => m.mountApp());
  });

  // Handle registration form submission
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Basic validation
    if (!name || !email || !password) {
      alert("❌ All fields are required");
      return;
    }

    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store authentication data (backend returns token on registration)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Show success message
      showToast("✅ Registration successful!");
      
      // Reload the app to show authenticated state
      setTimeout(() => {
        location.reload();
      }, 1000);

    } catch (err) {
      console.error("Registration error:", err);
      alert("❌ " + err.message);
    }
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}