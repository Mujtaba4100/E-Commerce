// ✅ UPDATED FILE: src/pages/cart.js

import { mountApp } from "../main.js";

export async function renderCartPage() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const cart = await res.json();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">🛒 Your Shopping Cart</h1>
      <ul class="space-y-4">
        ${cart.map(item => `
          <li class="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 class="font-semibold">${item.name}</h2>
              <p class="text-sm text-gray-600">$${item.price}</p>
              <div class="flex items-center gap-2 mt-1">
                <button class="decrease-qty px-2 bg-gray-200" data-id="${item._id}">−</button>
                <span>${item.quantity}</span>
                <button class="increase-qty px-2 bg-gray-200" data-id="${item._id}">+</button>
              </div>
            </div>
            <button class="remove-cart-item text-red-600" data-id="${item._id}">Remove</button>
          </li>
        `).join("")}
      </ul>
      <div class="mt-6 text-right font-bold text-lg">Total: $${total.toFixed(2)}</div>
      <div class="flex justify-between mt-6">
        <button id="go-home" class="bg-gray-300 text-black px-4 py-2 rounded">← Back</button>
        <button id="clear-cart" class="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
      </div>
    </div>
  `;

  document.querySelectorAll(".remove-cart-item").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      renderCartPage();
    });
  });

  document.querySelectorAll(".increase-qty").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const updated = await (await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })).json();
      const item = updated.find(i => i._id === id);
      await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: item.quantity + 1 })
      });
      renderCartPage();
    });
  });

  document.querySelectorAll(".decrease-qty").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const updated = await (await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })).json();
      const item = updated.find(i => i._id === id);
      if (item.quantity === 1) {
        await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: item.quantity - 1 })
        });
      }
      renderCartPage();
    });
  });

  document.getElementById("clear-cart").addEventListener("click", async () => {
    await fetch("http://localhost:3000/api/cart", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    renderCartPage();
  });

  document.getElementById("go-home").addEventListener("click", () => {
    mountApp();
  });
}
