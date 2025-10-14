const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = {
  async getProducts() {
    console.log(API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/product/`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async createUser(name: string, email: string) {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  async getUserOrders(userId: number) {
    const response = await fetch(`${API_BASE_URL}/user/order?id=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  async createOrder(
    userId: number,
    items: { productId: number; quantity: number }[]
  ) {
    const response = await fetch(`${API_BASE_URL}/user/order?id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }
    return response.json();
  },

  async createVendor(name: string, email: string) {
    const response = await fetch(`${API_BASE_URL}/vendor/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) throw new Error("Failed to create vendor");
    return response.json();
  },

  async addProduct(
    vendorId: number,
    product: { name: string; description: string; price: number; stock: number }
  ) {
    const response = await fetch(
      `${API_BASE_URL}/vendor/product?id=${vendorId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      }
    );
    if (!response.ok) throw new Error("Failed to add product");
    return response.json();
  },

  async getVendorProducts(vendorId: number) {
    const response = await fetch(
      `${API_BASE_URL}/vendor/product?id=${vendorId}`
    );
    if (!response.ok) throw new Error("Failed to fetch vendor products");
    return response.json();
  },
};
