
// src/pages/login.js

export function renderLoginPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 class="text-2xl font-bold mb-4 text-center">🔐 Login to Your Account</h2>
      <form id="login-form" class="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          class="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          class="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center mt-4">
        Don't have an account? <a href="#" id="register-link" class="text-blue-600 hover:underline">Register</a>
      </p>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      username: formData.get("username"),
      password: formData.get("password")
    };

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      alert("✅ Login successful!");
      location.reload();

    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  document.getElementById("register-link").addEventListener("click", (e) => {
    e.preventDefault();
    import("./register.js").then(m => m.renderRegisterPage());
  });
} 
