import "./styles.css";

const productForm = document.querySelector("#product-form");

const handleForm = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const formFinalData = {
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    image: formData.get("image"),
  };

  const reqConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formFinalData),
  };

  await fetch("http://localhost:3000/products", reqConfig);

  alert("Data has been sent to the server.");

  e.target.reset();
};

productForm.addEventListener("submit", handleForm);
