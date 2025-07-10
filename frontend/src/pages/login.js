// src/pages/login.js

export function renderLoginPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 class="text-2xl font-bold mb-4 text-center">🔐 Login to Your Account</h2>
      <form id="login-form" class="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          required
          minlength="6"
          class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center mt-4">
        Don't have an account? <a href="#" id="register-link" class="text-blue-600 hover:underline">Register</a>
      </p>
      <p class="text-sm text-center mt-2">
        <a href="#" id="home-link" class="text-gray-600 hover:underline">← Back to Home</a>
      </p>
    </div>
  `;

  // Handle form submission
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Show success message
      showToast("✅ Login successful!");
      
      // Reload the app to show authenticated state
      setTimeout(() => {
        location.reload();
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      alert("❌ " + err.message);
    }
  });

  // Go to register page
  document.getElementById("register-link").addEventListener("click", (e) => {
    e.preventDefault();
    import("./register.js").then(m => m.renderRegisterPage());
  });

  // Go back to home
  document.getElementById("home-link").addEventListener("click", (e) => {
    e.preventDefault();
    import("../main.js").then(m => m.mountApp());
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}