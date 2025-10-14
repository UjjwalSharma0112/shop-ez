import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  // 1. Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: { name: "TechStore", email: "techstore@example.com" }
  });

  const vendor2 = await prisma.vendor.create({
    data: { name: "FashionHub", email: "fashionhub@example.com" }
  });

  // 2. Create Products
  const product1 = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "Gaming Laptop",
      price: 80000,
      stock: 10,
      vendorId: vendor1.id
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Headphones",
      description: "Noise Cancelling",
      price: 5000,
      stock: 50,
      vendorId: vendor1.id
    }
  });

  const product3 = await prisma.product.create({
    data: {
      name: "T-Shirt",
      description: "Cotton T-Shirt",
      price: 800,
      stock: 100,
      vendorId: vendor2.id
    }
  });

  // 3. Create Users
  const user1 = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" }
  });

  const user2 = await prisma.user.create({
    data: { name: "Bob", email: "bob@example.com" }
  });

  // 4. Create Orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      total: 85000,
      status: "pending",
      items: {
        create: [
          { productId: product1.id, quantity: 1, price: 80000 },
          { productId: product2.id, quantity: 1, price: 5000 }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      total: 800,
      status: "completed",
      items: {
        create: [
          { productId: product3.id, quantity: 1, price: 800 }
        ]
      }
    }
  });

  console.log("Mock data seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
