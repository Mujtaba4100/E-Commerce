import "./styles.css";

const productForm = document.querySelector("#product-form");

const handleForm = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to add products");
    window.location.href = "./index.html";
    return;
  }

  const formFinalData = {
    name: formData.get("name"),
    price: parseFloat(formData.get("price")),
    description: formData.get("description"),
    image: formData.get("image"),
    category: formData.get("category") || "general",
    stock: parseInt(formData.get("stock")) || 0
  };

  console.log("Sending product data:", formFinalData);

  try {
    const reqConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formFinalData),
    };

    const response = await fetch("http://localhost:3000/api/products", reqConfig);
    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "./index.html";
        return;
      }
      throw new Error(result.message || "Failed to add product");
    }

    alert("✅ Product added successfully!");
    console.log("Product added:", result);
    e.target.reset();
    
  } catch (error) {
    console.error("Error adding product:", error);
    alert("❌ Failed to add product: " + error.message);
  }
};

productForm.addEventListener("submit", handleForm);

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to access admin panel");
    window.location.href = "./index.html";
  }
});