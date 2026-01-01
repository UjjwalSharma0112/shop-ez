import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const productData = [
  // Electronics
  { name: "Smartphone", description: "Latest model with advanced features" },
  { name: "Laptop", description: "Powerful and lightweight for professionals" },
  { name: "Headphones", description: "Noise-cancelling over-ear headphones" },
  { name: "Smartwatch", description: "Track your fitness and stay connected" },
  { name: "Tablet", description: "Portable and versatile for work and play" },
  { name: "Bluetooth Speaker", description: "Compact and waterproof with rich sound" },
  { name: "Gaming Console", description: "Next-gen gaming experience" },
  { name: "Digital Camera", description: "Capture stunning photos and videos" },
  { name: "E-reader", description: "Read your favorite books on the go" },
  { name: "Wireless Charger", description: "Fast and convenient charging" },
  // Clothing
  { name: "T-Shirt", description: "Comfortable and stylish cotton t-shirt" },
  { name: "Jeans", description: "Classic denim jeans for everyday wear" },
  { name: "Jacket", description: "Warm and waterproof for all weather" },
  { name: "Sneakers", description: "Lightweight and breathable for running" },
  { name: "Dress", description: "Elegant dress for special occasions" },
  { name: "Hoodie", description: "Cozy and soft for a relaxed fit" },
  { name: "Socks", description: "Pack of 5 cotton socks" },
  { name: "Hat", description: "Stylish cap to complete your look" },
  { name: "Scarf", description: "Warm and soft for cold days" },
  { name: "Gloves", description: "Keep your hands warm in winter" },
  // Home & Kitchen
  { name: "Coffee Maker", description: "Brew your perfect cup of coffee" },
  { name: "Blender", description: "Create smoothies and shakes with ease" },
  { name: "Air Fryer", description: "Healthy and delicious meals with less oil" },
  { name: "Vacuum Cleaner", description: "Powerful and lightweight for easy cleaning" },
  { name: "Cookware Set", description: "Non-stick pots and pans for your kitchen" },
  { name: "Knife Set", description: "Sharp and durable knives for all your needs" },
  { name: "Bed Sheets", description: "Soft and comfortable for a good night's sleep" },
  { name: "Towel Set", description: "Absorbent and soft towels for your bathroom" },
  { name: "Pillow", description: "Memory foam pillow for a comfortable sleep" },
  { name: "Desk Lamp", description: "Brighten up your workspace" },
  // Books
  { name: "The Great Gatsby", description: "A classic novel by F. Scott Fitzgerald" },
  { name: "To Kill a Mockingbird", description: "A novel by Harper Lee" },
  { name: "1984", description: "A dystopian novel by George Orwell" },
  { name: "The Catcher in the Rye", description: "A novel by J. D. Salinger" },
  { name: "The Lord of the Rings", description: "A fantasy novel by J. R. R. Tolkien" },
  { name: "The Hobbit", description: "A fantasy novel by J. R. R. Tolkien" },
  { name: "Pride and Prejudice", description: "A romantic novel by Jane Austen" },
  { name: "The Diary of a Young Girl", description: "The writings of Anne Frank" },
  { name: "The Alchemist", description: "A novel by Paulo Coelho" },
  { name: "The Hunger Games", description: "A dystopian novel by Suzanne Collins" },
];

async function main() {
  // 1. Create Vendors
  const vendors = [];
  for (let i = 0; i < 10; i++) {
    const vendor = await prisma.vendor.create({
      data: {
        name: `Vendor ${i + 1}`,
        email: `vendor${i + 1}@example.com`,
      },
    });
    vendors.push(vendor);
  }

  // 2. Create Products
  for (let i = 0; i < 100; i++) {
    const data = productData[i % productData.length];
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Math.floor(Math.random() * 1000) + 100,
        stock: Math.floor(Math.random() * 100) + 50,
        vendorId: vendors[i % vendors.length].id,
      },
    });
  }

  // 3. Create Users
  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      },
    });
  }

  console.log("Mock data seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
