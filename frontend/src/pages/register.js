// src/pages/register.js

export function renderRegisterPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="p-6 max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-4">📝 Register</h1>
      <form id="register-form" class="space-y-4">
        <input type="text" id="name" placeholder="Full Name" required class="w-full border p-2 rounded" />
        <input type="email" id="email" placeholder="Email" required class="w-full border p-2 rounded" />
        <input type="password" id="password" placeholder="Password" required class="w-full border p-2 rounded" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Register</button>
        <p class="text-sm mt-2">Already have an account? <a href="#" id="go-login" class="text-blue-600 underline">Login</a></p>
      </form>
    </div>
  `;

  document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    import("./login.js").then(m => m.renderLoginPage());
  });

  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      alert("✅ Registration successful");
      location.reload(); // Reload to go back to home
    } else {
      alert("❌ " + data.message);
    }
  });
}
